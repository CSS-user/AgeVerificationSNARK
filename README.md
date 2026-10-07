age_verification.circom - This is the circuit definition. It describes the logic for the ZKP

input.json - Inputs used for testing the Circuit

node_modules - Node dependencies

age_verififcation.wasm - The compiled circuit logic in WebAssembly. Used for witness generation.
witness_calculator.js - Handles the actual WASM memory operations and calculations. Computes witness in memory. Depends on the compiled .wasm circuit
generate_witness.js - Reads input, calls witness_calculator.js, writes .wtns file. Depends on witness_calculator.js

age_verification_0000.zkey - Initial proving key from your circuit’s R1CS and trusted setup (Phase 2 start).Holds cryptographic material for proof generation; not used directly in proofs.

age_verification_final.zkey - Final proving key after the full trusted setup, including all contributions and randomness.Used by the prover to generate ZK proofs; paired with a verification key for verification(.zkey contains all the data needed to produce the verification key).

age_verification.r1cs - The Rank-1 Constraint System representation of your circuit.Encodes all the circuit constraints in a mathematical form that SNARKs can use.

age_verification.sym - Maps internal signal names to R1CS rows (helps debug, see which signals correspond to which constraint)

pot12_0000.ptau - The initial Powers of Tau file, generated from scratch.Holds the initial random parameters.
pot12_0001.ptau - Intermediate Powers of Tau file after a contribution from a participant.
pot12_final.ptau - Final Powers of Tau file, completed after all contributions. Provides the final “phase 1” randomness used to generate the initial circuit .zkey.

verification_key.json - The key verifier uses to check a proof without seeing any secret data. Generated from final .zkey.

proof.json - Used while testing offline
public.json - Used while testing offline. Has the public outputs.
witness.wtns - Used while tesing offline. Has the witness.

index.html - The User(Prover). Fetch DoB from IdentityServer using phone number. Generates proof locally. Sends proof to Server for verification and display result.

identityServer.js - Stores the phone numbers and DoB.

Server - Verifier. Verifies the proof and returns the result.


Procedure

->   Install circom and rust 

->   Write the circuit 

//compiling your circuit into formats needed later for proving and verification
->   circom {circuit} --r1cs --wasm --sym -o outputs 

//downloading power of Tau file which is used for trusted setup in zk-SNARK(in outputs folder)
->   curl -O https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau

//generating the final proving and verification keys for your circuit
->   snarkjs groth16 setup outputs/product_circuit.r1cs outputs/powersOfTau28_hez_final_12.ptau outputs/product_final.zkey

//extracts the public verification key from your .zkey file so others can verify proofs
->   snarkjs zkey export verificationkey outputs/product_final.zkey verification_key.json

//generate witness
->   node outputs/product_circuit_js/generate_witness.js outputs/product_circuit_js/product_circuit.wasm inputs/input.json outputs/witness.wtns

//generates the zero-knowledge proof for your circuit using the witness
->   snarkjs groth16 prove outputs/product_final.zkey outputs/witness.wtns outputs/proof.json outputs/public.json

//verify the proof that you generated
->   snarkjs groth16 verify outputs/verification_key.json outputs/public.json outputs/proof.json