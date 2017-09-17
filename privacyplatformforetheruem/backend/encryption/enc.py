#!/usr/bin/python
from flask import Flask, jsonify, request, abort
from paillier.paillier import *
import pprint
import math
import time

app = Flask(__name__)

class Public:
	def __init__(self, p):
		self.g = int(p['g'])
		self.n = int(p['n'])
		self.n_sq = int(p['n_sq'])

class Private:
	def __init__(self, p):
		self.l = int(p['l'])
		self.m = int(p['m'])

@app.route('/generatekeys', methods=['GET'])
def generatekeys():
	if not request.args or not request.args['keysize']:
		abort(400)
	priv, pub = paillier.generate_keypair(int(request.args['keysize']))
	return jsonify({"public": {"n": pub.n, "n_sq": pub.n_sq, "g": pub.g} , "private": {"l": priv.l, "m": priv.m}})

@app.route('/encrypt', methods=['POST'])
def encrypt():
	start = time.time()
	if not request.json or not all(x in request.json for x in ['public_key', 'number']):	
		abort(400)
	
	pub = Public(request.json['public_key'])
	num = int(request.json['number'])
	print("before encrypton: ", num)
	enc_num = paillier.encrypt(pub, num)
	print("after encryption ", enc_num)
	end = time.time()
	print("TIME TAKEN IN ENCRYPT:")
	print(end - start)
	return jsonify({"enc_num": str(enc_num), "python_time": end-start}), 201

@app.route('/decrypt', methods=['POST'])
def decrypt():
	start = time.time()
	if not request.json or not all(x in request.json for x in ['public_key', 'private_key', 'number']):
		abort(400)

	pub = Public(request.json['public_key'])
	priv = Private(request.json['private_key'])
	num = int(request.json['number'])
	#print("before decryption ", num)
  	dec_num = paillier.decrypt(priv, pub, num)
	print("after decryption ", dec_num)

	end = time.time()
	print("TIME TAKEN IN DECRYPT:")
	print(end - start)
	return jsonify({"dec_num": str(dec_num), "python_time": end-start}), 201

@app.route('/to_montgo', methods=['POST'])
def to_montgo():
	start = time.time()
	if not request.json or not all(x in request.json for x in ['p', 'x']):
		abort(400)

	x = int(request.json['x'])
	p = int(request.json['p'])

	m = int(math.log(p, 2))+1
	R = 2**m

	x_m = (x * R) % p

	print("CONVERTING TO MONTGOMERY NUMBER:");
	print(x_m);	
	end = time.time()
	print("TIME TAKEN IN TO MONTGO:")
	print(end - start)
	#FIXME: do check for long or not and cut string based on that
	#return jsonify({"montgo_num": hex(x_m)[2:-1]})
	return jsonify({"montgo_num": str(hex(x_m)[2:-1]), "python_time": end-start})

@app.route('/from_montgo', methods=['POST'])
def from_montgo():
	start = time.time()
	if not request.json or not all(x in request.json for x in ['montgo_num', 'p']):
		abort(400)
	x_m_temp = str(request.json['montgo_num'])
	x_m = int(x_m_temp, 16)
	p = int(request.json['p'])

	m = int(math.log(p, 2))+1
	R = 2**m

	inv = modinv(R, p)
	x = (x_m * inv) % p
	print("CONVERTING BACK FROM MONTGOMERY: ")
	print(x)
	end = time.time()
	print("TIME TAKEN IN FROM MONTGO:")
	print(end - start)
	return jsonify({"num": str(x), "python_time": end-start})

@app.route('/extraparam_montgo', methods=['POST'])
def extraparam_montgo():
	start = time.time()
	if not request.json or not all(x in request.json for x in ['p']):
		abort(400)
	print("ENCRYPTIONS SEVER: ENTRA PARAMS")
	p = int(request.json['p'])

	m = int(math.log(p, 2))+1
	R = 2**m
	
	#print(R)
	inv = modinv(int(str(p)), R)
	#print(inv)
	q_prime = (-1 * inv) % R
	#print(q_prime)
	#print(p)
	end = time.time()
	print("TIME TAKEN IN EXTRAPARMS MONTGO:")
	print(end - start)
	#FIXME: do check for long or not and cut string based on that
	return jsonify({"q": str(hex(p)[2:-1]), "q_prime": str(hex(q_prime)[2:-1]), "digitsinR": m, "R": str(hex(R)[2:-1]), "python_time": end-start})
	#return jsonify({"q": str(hex(p)[2:-1]), "q_prime": str(hex(q_prime)[2:-1]), "digitsinR": m, "R": str(hex(R)[2:-1])})
	#return jsonify({"precomputed": prec, "m": m, "R": R})

#https://rosettacode.org/wiki/Modular_inverse#Python
def extended_gcd(aa, bb):
	lastremainder, remainder = abs(aa), abs(bb)
	x, lastx, y, lasty = 0, 1, 1, 0
	while remainder:
		lastremainder, (quotient, remainder) = remainder, divmod(lastremainder, remainder)
		x, lastx = lastx - quotient*x, x
		y, lasty = lasty - quotient*y, y
	return lastremainder, lastx * (-1 if aa < 0 else 1), lasty * (-1 if bb < 0 else 1)
 
def modinv(a, m):
	g, x, y = extended_gcd(a, m)
	if g != 1:
		raise ValueError
	return x % m


if __name__ == '__main__':
	app.run(debug=True)
