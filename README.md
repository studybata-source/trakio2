# trakio2

Utility: Generate permutations/combination-style lists

Quick usage:

```bash
# Permutations of length 2
python3 listgen.py perm -r 2 a b c

# Combinations of length 2
python3 listgen.py comb -r 2 a b c

# Combinations with replacement (length 2)
python3 listgen.py comb_rep -r 2 a b c

# Power set (size 1..2)
python3 listgen.py powerset --min 1 --max 2 a b c

# Cartesian product of groups [a,b] × [1,2]
python3 listgen.py product a,b 1,2

# Output as JSON
python3 listgen.py comb -r 2 -j a b c

# Count only
python3 listgen.py comb -r 2 -c a b c
```