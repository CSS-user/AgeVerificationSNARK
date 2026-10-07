pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";

template AgeVerification {
    signal input birthYear;
    signal input currentYear;
    signal input requiredAge;
    
    signal age;
    signal output isValidAge;

    age <== currentYear - birthYear;
    
    component cmp = GreaterEqThan(32);
    cmp.in[0] <== age;
    cmp.in[1] <== requiredAge;

    isValidAge <== cmp.out;

}

component main = AgeVerification();