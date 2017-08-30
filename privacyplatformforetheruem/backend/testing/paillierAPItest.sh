#!/bin/bash

# Step 1: Generate a 1024-bit public/private keypair
curl -i http://localhost:5000/generatekeys


#Step 2: Pick a number and encrypt it using the public key
curl -i -H "Content-Type: application/json" -X POST -d '{"public_key": {"g": "2869930398", "n": "2869930397",  "n_sq": "8236500483624577609"}, "number": 85783 }' http://localhost:5000/encrypt



#Step 3: Decrypt the encrypted number and compare with the original value
curl -i -H "Content-Type: application/json" -X POST -d '{"public_key": {"g": "2869930398", "n": "2869930397",  "n_sq": "8236500483624577609"}, "private_key": {"l": "2869822716",  "m": "1006971613"}, "number": 313742578544801978 }' http://localhost:5000/decrypt

