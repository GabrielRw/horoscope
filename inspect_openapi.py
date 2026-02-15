import requests
import json

def inspect(url):
    print(f"--- Inspecting {url} ---")
    try:
        res = requests.get(url, timeout=10)
        if res.status_code != 200:
            print(f"Failed: {res.status_code}")
            return
        data = res.json()
        paths = data.get('paths', {})
        for p, methods in paths.items():
            print(f"Path: {p}")
            for method, details in methods.items():
                print(f"  {method.upper()} params:")
                for param in details.get('parameters', []):
                    print(f"    - {param.get('name')} ({param.get('in')})")
    except Exception as e:
        print(f"Error: {e}")

inspect("https://api.freeastroapi.com/openapi.json")
