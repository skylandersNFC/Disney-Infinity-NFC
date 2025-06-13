# Disney Infinity Keys Generator

This page can be used to generate keys for Disney Infinity figures using their 7-byte UID. 

### How to Use:

1. Type your card **UID** and click "**Generate**" button.
2. Download the "**UID_You_Have_Typed.keys**" file.
3. Go inside "**Mifare Windows Tool v1.6\keys**" folder and place the **.keys** file there.
4. Inside "**MWT**" click "**READ TAG**" with the same tag placed on the **ACR122U** reader
5. Select the **new keys** instead of "**std.keys**" and click on "**Start Decode & Read tag**".
6. Wait a moment. If you receive any **warnings**, **unplug and plug the USB cable** of the reader back in, then try again.
7. When done, you should see a **popup** window.
8. **That's it**, your already written tag was **decrypted** successfully.
9. At the bottom of this window, click on "**Save Dump As**" if you want to save this dump.
