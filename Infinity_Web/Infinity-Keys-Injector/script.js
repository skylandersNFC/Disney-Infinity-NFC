function generateKeyFromUID(uidHex, callback) {
    const prefixNumber = BigInt(3 * 5 * 23) * 38844225342798321268237511320137937n;
    const postfixNumber = BigInt(3 * 7) * 9985861487287759675192201655940647n;

    const prefixHex = prefixNumber.toString(16).padStart(32, '0');
    const postfixHex = postfixNumber.toString(16).padStart(30, '0');

    const fullHex = prefixHex + uidHex + postfixHex;
    const fullBytes = hexToBytes(fullHex);

    crypto.subtle.digest('SHA-1', fullBytes).then(function(hashBuffer) {
        const hashArray = new Uint8Array(hashBuffer);
        const keyBytes = [hashArray[3], hashArray[2], hashArray[1], hashArray[0], hashArray[7], hashArray[6]];
        callback(new Uint8Array(keyBytes));
    }).catch(function(error) {
        alert("Hashing failed: " + error);
    });
}

function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}

function injectKeysIntoBuffer(originalBuffer, offsets, key) {
    const buffer = new Uint8Array(originalBuffer);  // Make a writable copy
    offsets.forEach(offset => {
        for (let i = 0; i < key.length; i++) {
            if (offset + i < buffer.length) {
                buffer[offset + i] = key[i];
            }
        }
    });
    return buffer;
}

function processBinFile(inputArrayBuffer, offsets, uidHex, callback) {
    generateKeyFromUID(uidHex, function(key) {
        const result = injectKeysIntoBuffer(inputArrayBuffer, offsets, key);
        callback(result);
    });
}

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const fileBytes = new Uint8Array(arrayBuffer);

        // Extract UID from the first 7 bytes
        const uidBytes = fileBytes.slice(0, 7);
        const uidHex = Array.from(uidBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        console.log("Extracted UID:", uidHex);

        // Prepare the offsets
        const baseOffsets = [0x30, 0x3A];
        const blockShifts = [0x00, 0x40, 0x80, 0xC0, 0x100];
        const offsets = [];

        blockShifts.forEach(shift => {
            baseOffsets.forEach(base => offsets.push(shift + base));
        });

        console.log("Injecting key at offsets:", offsets.map(x => `0x${x.toString(16).toUpperCase()}`).join(', '));

        processBinFile(arrayBuffer, offsets, uidHex, function(patchedBytes) {
            const blob = new Blob([patchedBytes], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);

            const link = document.getElementById('download1k');
            link.href = url;
            link.download = file.name.replace(/(\.\w+)?$/, ".bin");
            link.style.display = "inline-block";
            link.querySelector('label').innerText = "Download Converted File";
        });
    };

    reader.onerror = function() {
        alert("Failed to read the file!");
    };

    reader.readAsArrayBuffer(file);
});
