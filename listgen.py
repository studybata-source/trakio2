#!/usr/bin/env python3
"""
listgen.py — Generate all possible lists: permutations, combinations, power sets, and Cartesian products.

Examples:
  - Permutations of length 2 from [a b c]
      python3 listgen.py perm -r 2 a b c

  - Combinations of length 3 from [a b c d]
      python3 listgen.py comb -r 3 a b c d

  - Combinations with replacement of length 2
      python3 listgen.py comb_rep -r 2 a b c

  - Power set from length 1..2
      python3 listgen.py powerset --min 1 --max 2 a b c

  - Cartesian product of groups [a,b] × [1,2] × [x,y]
      python3 listgen.py product a,b 1,2 x,y

Use -j/--json for JSON output, -c/--count-only to print only the count.
Use -f/--file to read items (one per line) from a file for commands that take a single item list.
"""

from __future__ import annotations

import argparse
import itertools as it
import json
import math
import sys
from typing import Iterable, Iterator, List, Sequence, Tuple


def parse_items_from_file(path: str) -> List[str]:
    with open(path, "r", encoding="utf-8") as f:
        return [line.rstrip("\n\r") for line in f if line.strip() != ""]


def parse_items_from_args(tokens: List[str]) -> List[str]:
    if len(tokens) == 0:
        return []
    if len(tokens) == 1 and "," in tokens[0]:
        return [part for part in tokens[0].split(",")]
    return tokens


def parse_group_spec(group_specs: List[str]) -> List[List[str]]:
    groups: List[List[str]] = []
    for spec in group_specs:
        groups.append([part for part in spec.split(",")])
    return groups


def powerset(iterable: Sequence[str], min_len: int = 0, max_len: int | None = None) -> Iterator[Tuple[str, ...]]:
    items = list(iterable)
    n = len(items)
    if max_len is None:
        max_len = n
    if min_len < 0 or max_len < 0 or min_len > max_len:
        raise ValueError("Invalid min/max lengths for powerset")
    for r in range(min_len, max_len + 1):
        for combo in it.combinations(items, r):
            yield combo


def emit(iterable: Iterable[Sequence[str]], as_json: bool, count_only: bool, limit: int | None) -> None:
    if count_only:
        # Avoid materializing huge outputs; just count efficiently when possible
        # If we cannot compute combinatorially, we fall back to iterating.
        total = 0
        for _ in iterable:
            total += 1
        print(total)
        return

    if as_json:
        out: List[List[str]] = []
        for idx, rec in enumerate(iterable):
            if limit is not None and idx >= limit:
                break
            out.append([str(x) for x in rec])
        json.dump(out, sys.stdout, ensure_ascii=False)
        sys.stdout.write("\n")
        return

    # Default: CSV per line
    count = 0
    for rec in iterable:
        if limit is not None and count >= limit:
            break
        print(",".join(str(x) for x in rec))
        count += 1


def compute_count_for_powerset(n: int, min_len: int, max_len: int | None) -> int:
    if max_len is None:
        max_len = n
    total = 0
    for r in range(min_len, max_len + 1):
        total += math.comb(n, r)
    return total


def main() -> None:
    common_parser = argparse.ArgumentParser(add_help=False)
    common_parser.add_argument("-j", "--json", action="store_true", help="Output JSON array instead of CSV lines")
    common_parser.add_argument("-c", "--count-only", action="store_true", help="Print only the count of results")
    common_parser.add_argument("--limit", type=int, default=None, help="Limit the number of results shown")

    items_parser = argparse.ArgumentParser(add_help=False)
    items_parser.add_argument("-f", "--file", help="Path to file containing items, one per line")

    parser = argparse.ArgumentParser(prog="listgen.py", description="Generate permutations, combinations, power sets, and Cartesian products")
    subparsers = parser.add_subparsers(dest="cmd", required=True)

    # permutations
    p_perm = subparsers.add_parser("perm", parents=[common_parser, items_parser], help="Permutations of items")
    p_perm.add_argument("items", nargs="*", help="Items (space separated or single comma-separated string)")
    p_perm.add_argument("-r", "--r", type=int, default=None, help="Permutation length (default: len(items))")

    # combinations
    p_comb = subparsers.add_parser("comb", parents=[common_parser, items_parser], help="Combinations of items")
    p_comb.add_argument("items", nargs="*", help="Items (space separated or single comma-separated string)")
    p_comb.add_argument("-r", "--r", type=int, required=True, help="Combination length")

    # combinations with replacement
    p_comb_rep = subparsers.add_parser("comb_rep", parents=[common_parser, items_parser], help="Combinations with replacement")
    p_comb_rep.add_argument("items", nargs="*", help="Items (space separated or single comma-separated string)")
    p_comb_rep.add_argument("-r", "--r", type=int, required=True, help="Length of each combination")

    # powerset
    p_powerset = subparsers.add_parser("powerset", parents=[common_parser, items_parser], help="Power set of items")
    p_powerset.add_argument("items", nargs="*", help="Items (space separated or single comma-separated string)")
    p_powerset.add_argument("--min", dest="min_len", type=int, default=0, help="Minimum subset size (default: 0)")
    p_powerset.add_argument("--max", dest="max_len", type=int, default=None, help="Maximum subset size (default: n)")

    # product
    p_product = subparsers.add_parser("product", parents=[common_parser], help="Cartesian product of groups")
    p_product.add_argument("groups", nargs="+", help="Each argument is a comma-separated group, e.g., 'a,b' '1,2'")

    args = parser.parse_args()

    if args.cmd in {"perm", "comb", "comb_rep", "powerset"}:
        items: List[str]
        if getattr(args, "file", None):
            items = parse_items_from_file(args.file)
        else:
            items = parse_items_from_args(args.items)
        if len(items) == 0:
            parser.error("No items provided. Pass items as arguments or use -f/--file.")

    if args.cmd == "perm":
        r = args.r if args.r is not None else len(items)
        if r < 0:
            parser.error("r must be >= 0")
        if r > len(items):
            parser.error("r cannot be greater than number of items for permutations")
        iterable = it.permutations(items, r)
        if args.count_only:
            # P(n, r) = C(n, r) * r!
            total = math.comb(len(items), r) * math.factorial(r)
            print(total)
            return
        emit(iterable, args.json, args.count_only, args.limit)
        return

    if args.cmd == "comb":
        r = args.r
        if r < 0 or r > len(items):
            parser.error("r must be in range [0, n] for combinations")
        iterable = it.combinations(items, r)
        if args.count_only:
            print(math.comb(len(items), r))
            return
        emit(iterable, args.json, args.count_only, args.limit)
        return

    if args.cmd == "comb_rep":
        r = args.r
        if r < 0:
            parser.error("r must be >= 0")
        iterable = it.combinations_with_replacement(items, r)
        if args.count_only:
            # C(n + r - 1, r)
            print(math.comb(len(items) + r - 1, r))
            return
        emit(iterable, args.json, args.count_only, args.limit)
        return

    if args.cmd == "powerset":
        min_len = args.min_len
        max_len = args.max_len
        if min_len < 0:
            parser.error("--min must be >= 0")
        if max_len is not None and max_len < 0:
            parser.error("--max must be >= 0")
        if max_len is not None and min_len > max_len:
            parser.error("--min cannot be greater than --max")
        iterable = powerset(items, min_len=min_len, max_len=max_len)
        if args.count_only:
            print(compute_count_for_powerset(len(items), min_len, max_len))
            return
        emit(iterable, args.json, args.count_only, args.limit)
        return

    if args.cmd == "product":
        group_specs: List[str] = args.groups
        groups = parse_group_spec(group_specs)
        if len(groups) == 0:
            parser.error("Provide at least one group (comma-separated), e.g., a,b 1,2")
        iterable = it.product(*groups)
        if args.count_only:
            total = 1
            for g in groups:
                total *= len(g)
            print(total)
            return
        emit(iterable, args.json, args.count_only, args.limit)
        return

    parser.error("Unknown command")


if __name__ == "__main__":
    main()