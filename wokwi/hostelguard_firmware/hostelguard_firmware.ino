// HostelGuard — Gas & Fire Safety Monitor
// ESP32 firmware: reads MQ-2 (gas), DHT22 (temp/humidity), and a photoresistor
// standing in for a flame sensor's analog output (Wokwi has no native flame
// sensor part — swap FLAME_PIN wiring for a real KY-026 module on real hardware).
// Posts readings + alerts straight to Supabase's REST API, no custom backend needed.

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <DHT.h>
#include "supabase_config.h"

// ---- WiFi ----
// "Wokwi-GUEST" only works inside the Wokwi simulator and has real internet
// access. On real hardware, replace with your actual WiFi credentials.
const char *WIFI_SSID = "Wokwi-GUEST";
const char *WIFI_PASS = "";

// ---- Pins ----
#define DHT_PIN 4
#define GAS_PIN 34   // MQ-2 analog out (ADC1, safe to use with WiFi on)
#define FLAME_PIN 35 // flame-sensor stand-in, analog out (ADC1)
#define BUZZER_PIN 25
#define ALARM_LED_PIN 26

#define DHTTYPE DHT22 // Wokwi's DHT part behaves as a DHT22; use DHT11 on real hardware
DHT dht(DHT_PIN, DHTTYPE);

// ---- Alarm thresholds — tune these while testing ----
const int GAS_THRESHOLD = 1500;    // raw ADC, 0-4095
const int FLAME_THRESHOLD = 3000;  // raw ADC, higher = brighter/closer flame
const float TEMP_THRESHOLD = 45.0; // °C

const char *ROOM_LABEL = "Hostel Block A - Room 204";

unsigned long lastReadingPost = 0;
const unsigned long READING_INTERVAL_MS = 5000;

bool alarmActive = false;

void connectWiFi()
{
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(300);
    Serial.print(".");
  }
  Serial.println(" connected");
}

void setup()
{
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(ALARM_LED_PIN, OUTPUT);
  dht.begin();
  connectWiFi();
}

void setAlarm(bool on)
{
  digitalWrite(BUZZER_PIN, on ? HIGH : LOW);
  digitalWrite(ALARM_LED_PIN, on ? HIGH : LOW);
}

void postReading(float temp, float hum, int gasRaw, int flameRaw, bool alarm)
{
  if (WiFi.status() != WL_CONNECTED)
    return;

  WiFiClientSecure client;
  client.setInsecure(); // demo only — skips TLS cert validation

  HTTPClient http;
  String url = String(SUPABASE_URL) + "/rest/v1/readings";
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", SUPABASE_ANON_KEY);
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_ANON_KEY);
  http.addHeader("Prefer", "return=minimal");

  String body = "{";
  body += "\"room_label\":\"" + String(ROOM_LABEL) + "\",";
  body += "\"temperature\":" + String(temp, 1) + ",";
  body += "\"humidity\":" + String(hum, 1) + ",";
  body += "\"gas_raw\":" + String(gasRaw) + ",";
  body += "\"flame_level\":" + String(flameRaw) + ",";
  body += "\"alarm\":" + String(alarm ? "true" : "false");
  body += "}";

  int code = http.POST(body);
  Serial.printf("[readings] POST -> %d\n", code);
  http.end();
}

void postAlert(const char *type, const char *message)
{
  if (WiFi.status() != WL_CONNECTED)
    return;

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  String url = String(SUPABASE_URL) + "/rest/v1/alerts";
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", SUPABASE_ANON_KEY);
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_ANON_KEY);
  http.addHeader("Prefer", "return=minimal");

  String body = "{";
  body += "\"room_label\":\"" + String(ROOM_LABEL) + "\",";
  body += "\"alert_type\":\"" + String(type) + "\",";
  body += "\"severity\":\"critical\",";
  body += "\"message\":\"" + String(message) + "\"";
  body += "}";

  int code = http.POST(body);
  Serial.printf("[alerts] POST -> %d\n", code);
  http.end();
}

void loop()
{
  int gasRaw = analogRead(GAS_PIN);
  int flameRaw = analogRead(FLAME_PIN);
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  bool gasBreach = gasRaw > GAS_THRESHOLD;
  bool flameBreach = flameRaw > FLAME_THRESHOLD;
  bool tempBreach = !isnan(temp) && temp > TEMP_THRESHOLD;
  bool shouldAlarm = gasBreach || flameBreach || tempBreach;

  Serial.printf("gas=%d flame=%d temp=%.1f hum=%.1f alarm=%d\n",
                gasRaw, flameRaw, temp, hum, shouldAlarm);

  setAlarm(shouldAlarm);

  // Only fire a new alert row on the OFF -> ON transition, so the log
  // doesn't spam one row per loop while a hazard is ongoing.
  if (shouldAlarm && !alarmActive)
  {
    if (gasBreach)
      postAlert("gas", "Gas/smoke level exceeded safe threshold");
    if (flameBreach)
      postAlert("fire", "Flame sensor triggered");
    if (tempBreach)
      postAlert("temperature", "Room temperature abnormally high");
  }
  alarmActive = shouldAlarm;

  if (millis() - lastReadingPost > READING_INTERVAL_MS)
  {
    lastReadingPost = millis();
    postReading(temp, hum, gasRaw, flameRaw, shouldAlarm);
  }

  delay(1000);
}
