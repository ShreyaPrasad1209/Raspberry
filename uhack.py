#!/usr/bin/env python
# coding: utf-8

# In[ ]:


from boltiot import Bolt, Sms #Import Sms and Bolt class from boltiot library  
import json, time,requests
SID="ACc86d909fe28d6f95a83cb056e1bba0da"
AUTH_TOKEN="3a476d5fb97befaf4247e1e39f82d361"
TO_NUMBER="+918826212377"
FROM_NUMBER="+12026186745"
Channel_ID="-1001237675569"
Tele_BotID="bot937112328:AAHg0yQoL09hJiLHVdo78xNFX9kZ9E7F75I"
SMS=Sms(SID,AUTH_TOKEN,TO_NUMBER,FROM_NUMBER)                          
def Twilio_message(message):
        try:
                print('Sending message through twilio')
                response=SMS.send_sms(message)
                print('The status of twilio messsage is:',str(response.status))
        except Exception as e:
                print("Error occured in Twilio message",e)
                print(e)
                return False
def Tele_message(message):
        url='https://api.telegram.org/'+Tele_BotID+ '/sendMessage'
        data={'chat_id':Channel_ID,'text':message}
        try:
                response=requests.request("GET",url,params=data)
                print('This is the Telegram response')
                print(response.text)
                telegram_data=json.loads(response.text)
                return telegram_data["ok"]
        except Exception as e:
                print("Error occured in sending message via Telegram")
                print(e)
                return False
Bolt_ID="BOLT6098139"
API_Key='f04bfd50-9d89-42a8-a957-ff2cfe9fd930'
garbage_full_limit = 7 # the distance between device and  garbage in dustbin
mybolt = Bolt(API_Key,Bolt_ID)#This is to access the bolt device and send commands
response = mybolt.serialRead('10')#fetch data from arduino
message="Hello Brother, the trash can is full"
while True:
        response = mybolt.serialRead('10')  #Fetching the value from Arduino 
        data = json.loads(response)
        garbage_limit = data['value'].rstrip()
        print("Garbage level is", garbage_limit)
        if int(garbage_limit)<garbage_full_limit:
                Twilio_message(message)
                Tele_message(message)
        time.sleep(10)

