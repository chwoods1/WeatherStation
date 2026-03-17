from flask import Flask, jsonify
import time, math, random, os

# Set up our flask service
app = Flask(__name__)
t = 0

# Our /read endpoint used by the sampler to sample the sensor
@app.route('/read')
def read():
    global t
    # Creates a semi random variable voltage within 0-5v
    voltage = 2.5 + 1.5 * math.sin(t / 10) + random.uniform(-0.1, 0.1)
    print(f"Voltage: {round(voltage, 2)} V")
    t += 1
    # Combines the voltage with the time it was taken and returns it as a JSON
    return jsonify({'voltage': round(voltage, 2), 'timestamp': time.time()})

# Starts our flask service on the localhost using port 5000, also uses self signed
# cert and key which allows for the use of https
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, ssl_context=('cert.pem', 'key.pem'))