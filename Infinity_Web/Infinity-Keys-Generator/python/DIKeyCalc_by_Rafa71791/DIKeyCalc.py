import hashlib

uid_input = input("Enter your UID: ")
uid = uid_input.replace(" ", "")

prefix_number = 3 * 5 * 23 * 38844225342798321268237511320137937
prefix_hex = f"{prefix_number:032x}"  # 16-byte (32-character) hex representation

postfix_number = 3 * 7 * 9985861487287759675192201655940647
postfix_hex = f"{postfix_number:030x}"  # 15-byte (30-character) hex representation

concatenation_hex = prefix_hex + uid + postfix_hex

concatenation_bytes = bytes.fromhex(concatenation_hex)
sha1_digest = hashlib.sha1(concatenation_bytes).digest()

key_a_bytes = sha1_digest[3:4] + sha1_digest[2:3] + sha1_digest[1:2] + sha1_digest[0:1] + sha1_digest[7:8] + sha1_digest[6:7]
key_a_hex = key_a_bytes.hex()

print(f"Here is your Key:\n{key_a_hex}")