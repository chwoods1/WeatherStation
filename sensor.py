import time
import math
import random

t = 0

while True:
    voltage = 2.5 + 1.5 * math.sin(t / 10) + random.uniform(-0.1, 0.1)
    print(f"Voltage: {round(voltage, 2)} V")
    t += 1
    time.sleep(1)