from flask import Flask, jsonify
import time, math, random, os

app = Flask(__name__)
t = 0

@app.route('/read')
def read():
    global t
    voltage = 2.5 + 1.5 * math.sin(t / 10) + random.uniform(-0.1, 0.1)
    print(f"Voltage: {round(voltage, 2)} V")
    t += 1
    return jsonify({'voltage': round(voltage, 2), 'timestamp': time.time()})
    
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)