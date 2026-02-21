# ================================================================
# main.py — JSON data format unifier
# ---------------------------------------------------------------
# This script reads two JSON files (data-1.json and data-2.json),
# each representing telemetry data in a different format.
#
# Your task is to unify both into a single, common format that
# matches the example structure shown in data-result.json.
#
# The Replit project will automatically test this code when you run it.
# ================================================================

import json
from datetime import datetime, timezone

# ================================================================
# Function: convert_iso_to_millis
# ---------------------------------------------------------------
# Converts a timestamp in ISO 8601 format (e.g. "2025-11-06T12:34:56.789Z")
# into milliseconds since the Unix epoch (UTC).
# The target unified format uses timestamps in milliseconds.
# ================================================================
def convert_iso_to_millis(iso_timestamp):
    # Replace the 'Z' at the end (indicating UTC) with '+00:00'
    # because datetime.fromisoformat() does not accept 'Z' directly.
    dt = datetime.fromisoformat(iso_timestamp.replace("Z", "+00:00"))
    
    # Convert to milliseconds by multiplying seconds by 1000
    return int(dt.timestamp() * 1000)

# ================================================================
# Function: unify_data_format
# ---------------------------------------------------------------
# Converts input data from either of the two possible formats
# (found in data-1.json and data-2.json) into a unified format.
#
# The final unified format should look like this:
# {
#   "deviceId": "sensor-1",
#   "timestamp": 1730894096789,
#   "values": { "temperature": 22.5, "humidity": 60 }
# }
# ================================================================
def unify_data_format(data):
    # Check which format this data object uses.
    # ------------------------------------------------------------
    # Format 1 Example (data-1.json):
    # {
    #   "device": { "id": "sensor-1" },
    #   "timestamp": "2025-11-06T12:34:56.789Z",
    #   "readings": { "temperature": 22.5, "humidity": 60 }
    # }
    #
    # Format 2 Example (data-2.json):
    # {
    #   "id": "sensor-1",
    #   "timestamp": 1730894096789,
    #   "telemetry": { "temperature": 22.5, "humidity": 60 }
    # }
    # ------------------------------------------------------------

    if "device" in data:
        # This is Format 1 (ISO timestamp, nested 'device' and 'readings')
        return {
            "deviceId": data["device"]["id"],                     # Extract device ID
            "timestamp": convert_iso_to_millis(data["timestamp"]), # Convert timestamp to milliseconds
            "values": data["readings"]                             # Rename 'readings' → 'values'
        }

    elif "id" in data:
        # This is Format 2 (milliseconds timestamp, flat structure)
        return {
            "deviceId": data["id"],            # Rename 'id' → 'deviceId'
            "timestamp": data["timestamp"],    # Timestamp already in milliseconds
            "values": data["telemetry"]        # Rename 'telemetry' → 'values'
        }

    else:
        # If neither format matches, raise an error for debugging
        raise ValueError("Unknown data format detected.")

# ================================================================
# MAIN EXECUTION BLOCK
# ---------------------------------------------------------------
# When you click 'Run' in Replit, this block will:
# 1. Load both JSON files (data-1.json and data-2.json)
# 2. Pass their contents to unify_data_format()
# 3. Print the results for inspection
# ================================================================
if __name__ == "__main__":
    # Load input JSON files
    with open("data-1.json") as f1, open("data-2.json") as f2:
        d1 = json.load(f1)
        d2 = json.load(f2)

    # Convert both datasets into the target unified format
    unified_1 = unify_data_format(d1)
    unified_2 = unify_data_format(d2)

    # Print both results (for visual confirmation)
    print("Unified Data from data-1.json:")
    print(json.dumps(unified_1, indent=2))

    print("\nUnified Data from data-2.json:")
    print(json.dumps(unified_2, indent=2))

# ================================================================
# END OF FILE
# ================================================================
