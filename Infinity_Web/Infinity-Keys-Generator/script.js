document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form').addEventListener('submit', function (e) {
        e.preventDefault();

        const uid = document.getElementById('nuid-input').value.trim();

        if (uid.length !== 14 || !/^[0-9a-fA-F]+$/.test(uid)) {
            alert("UID must be exactly 14 hexadecimal characters.");
            return;
        }

        const prefixNumber = 3n * 5n * 23n * 38844225342798321268237511320137937n;
        const postfixNumber = 3n * 7n * 9985861487287759675192201655940647n;

        const prefixHex = prefixNumber.toString(16).padStart(32, '0');
        const postfixHex = postfixNumber.toString(16).padStart(30, '0');

        const fullHex = prefixHex + uid + postfixHex;

        const hexToBytes = (hex) =>
            new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        const bytes = hexToBytes(fullHex);

        crypto.subtle.digest("SHA-1", bytes).then(hashBuffer => {
            const hash = new Uint8Array(hashBuffer);

            const keyBytes = [
                hash[3], hash[2], hash[1], hash[0], hash[7], hash[6]
            ];

            const keyHex = keyBytes.map(b => b.toString(16).padStart(2, '0')).join('');

			document.getElementById('key-list').innerHTML = `<strong>${keyHex}</strong>`;

            const blob = new Blob([keyHex], { type: 'text/plain' });
            const downloadBtn = document.getElementById('download-btn');
            downloadBtn.style.display = 'block';
            downloadBtn.onclick = () => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${uid}.keys`;
                a.click();
            };
        });
    });
});
