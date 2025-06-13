import os

def read_nfc_bin(file_path):
    with open(file_path, 'rb') as f:
        return bytearray(f.read())

def write_nfc_bin(file_path, data):
    with open(file_path, 'wb') as f:
        f.write(data)

def needs_wipe(data):
    for sector in range(5):
        base = sector * 64
        for i in range(base + 0x20, base + 0x2F + 1):
            if i < len(data) and data[i] != 0x00:
                return True
    for sector in [1, 2]:
        base = sector * 64
        for i in range(base + 0x10, base + 0x1F + 1):
            if i < len(data) and data[i] != 0x00:
                return True
    return False

def wipe_disney_infinity_data(data):
    for sector in range(5):
        base = sector * 64
        for i in range(base + 0x20, base + 0x2F + 1):
            if i < len(data):
                data[i] = 0x00
    for sector in [1, 2]:
        base = sector * 64
        for i in range(base + 0x10, base + 0x1F + 1):
            if i < len(data):
                data[i] = 0x00
    return data

def process_bin_files(script_dir):
    for root, dirs, files in os.walk(script_dir):
        for filename in files:
            if filename.endswith('.bin'):
                full_path = os.path.join(root, filename)
                rel_path = os.path.relpath(full_path, start=script_dir)
                data = read_nfc_bin(full_path)
                if len(data) == 320 and needs_wipe(data):
                    data = wipe_disney_infinity_data(data)
                    write_nfc_bin(full_path, data)
                    print(f"Wiped: {rel_path}")

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    process_bin_files(script_dir)
    input("Press Enter to exit...")
