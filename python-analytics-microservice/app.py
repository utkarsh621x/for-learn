from flask import Flask, jsonify, request
import time
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

app = Flask(__name__)

# ========================================================
# PROMETHEUS METRICS CONFIGURATION (Golden Signals)
# ========================================================
# 1. Total HTTP Requests Counter
REQUEST_COUNT = Counter(
    'http_requests_total', 
    'Total HTTP Requests', 
    ['method', 'endpoint', 'http_status']
)

# 2. Request Latency Histogram
REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds', 
    'HTTP request latency in seconds', 
    ['endpoint']
)

# Middleware to record request metrics for Prometheus
@app.before_request
def start_timer():
    request._start_time = time.time()

@app.after_request
def record_metrics(response):
    if hasattr(request, '_start_time'):
        latency = time.time() - request._start_time
        REQUEST_LATENCY.labels(endpoint=request.path).observe(latency)
        REQUEST_COUNT.labels(
            method=request.method, 
            endpoint=request.path, 
            http_status=response.status_code
        ).inc()
    return response

# Prometheus scraping endpoint
@app.route('/metrics')
def metrics():
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}

# Liveness / Readiness Health Check
@app.route('/healthz')
def health():
    return jsonify({
        "status": "healthy",
        "service": "python-analytics-microservice",
        "version": "1.2.0"
    }), 200

# Core Microservice Business Endpoints
@app.route('/api/v1/analytics/orders', methods=['GET'])
def get_order_analytics():
    return jsonify({
        "daily_orders": 1420,
        "revenue_inr": 854000,
        "delivery_success_rate": "98.7%",
        "avg_delivery_time_mins": 28
    })

@app.route('/api/v1/notifications/dispatch', methods=['POST'])
def dispatch_notification():
    data = request.get_json() or {}
    order_id = data.get('order_id', 'UNKNOWN')
    return jsonify({
        "status": "QUEUED",
        "order_id": order_id,
        "channel": "SMS_AND_WHATSAPP",
        "message": "Out for delivery"
    }), 202

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
