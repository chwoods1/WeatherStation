import os, time, math
from flask import Flask, jsonify, request
from app import app

@app.route('/transform', methods=['POST'])
def transform():
    #gets the voltage and timestamp from POST
    if request.method == 'POST':
        voltage = request.form.get('voltage')
        timestamp = request.form.get('timestamp')
        
    # Check if voltage is provided
    if voltage is None:
        return jsonify({'error': 'Voltage value is required'}), 400
    temperature = transform_data(voltage)
    return jsonify({'temperature': temperature, 'timestamp': timestamp}), 200
    

def transform_data(voltage):
    # Converts the voltage to a temperature
    temperature = (voltage - 0.5) * 20
    print(f"Temperature: {round(temperature, 2)} °C")
    return round(temperature, 2)

# Starts our flask service on the localhost using port 5000, also uses self signed
# cert and key which allows for the use of https
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 4000))
    app.run(host='0.0.0.0', port=port, ssl_context=('cert.pem', 'key.pem'))