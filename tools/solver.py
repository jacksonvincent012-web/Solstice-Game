"""Solstice level solver — DFS over mirror placements with beam-aware pruning."""

import time
from copy import deepcopy

GRID_SIZE = 8
EMPTY, MIRROR_FWD, MIRROR_BACK, WALL = 0, 1, 2, 3
SUN_EMITTER, MOON_EMITTER = 4, 5
SUN_RECEPTOR, MOON_RECEPTOR = 6, 7


def trace_ray(grid, sx, sy, dx, dy, receptor_type, emitter_type):
    x, y = sx + dx, sy + dy
    visited = set()
    path = []
    while 0 <= x < GRID_SIZE and 0 <= y < GRID_SIZE:
        key = (x, y)
        if key in visited:
            break
        visited.add(key)
        path.append((x, y))
        cell = grid[y][x]
        if cell == WALL:
            break
        if cell == receptor_type:
            return path, True
        if cell == MIRROR_FWD:
            dx, dy = -dy, -dx
        elif cell == MIRROR_BACK:
            dx, dy = dy, dx
        elif cell == emitter_type:
            break
        x += dx
        y += dy
    return path, False


def trace_all(grid, is_day):
    for y in range(GRID_SIZE):
        for x in range(GRID_SIZE):
            cell = grid[y][x]
            if is_day and cell == SUN_EMITTER:
                _, hit = trace_ray(grid, x, y, 1, 0, SUN_RECEPTOR, SUN_EMITTER)
                if hit:
                    return True
            elif not is_day and cell == MOON_EMITTER:
                _, hit = trace_ray(grid, x, y, -1, 0, MOON_RECEPTOR, MOON_EMITTER)
                if hit:
                    return True
    return False


def check_win(grid):
    has_sun = any(SUN_EMITTER in row for row in grid)
    has_moon = any(MOON_EMITTER in row for row in grid)
    sun_ok = (not has_sun) or trace_all(grid, True)
    moon_ok = (not has_moon) or trace_all(grid, False)
    return sun_ok and moon_ok


def get_reachable_empty(grid):
    """Return set of (x,y) empty cells on any beam path in current grid state."""
    cells = set()
    for y in range(GRID_SIZE):
        for x in range(GRID_SIZE):
            cell = grid[y][x]
            if cell == SUN_EMITTER:
                p, _ = trace_ray(grid, x, y, 1, 0, SUN_RECEPTOR, SUN_EMITTER)
                for cx, cy in p:
                    if grid[cy][cx] == EMPTY:
                        cells.add((cx, cy))
            elif cell == MOON_EMITTER:
                p, _ = trace_ray(grid, x, y, -1, 0, MOON_RECEPTOR, MOON_EMITTER)
                for cx, cy in p:
                    if grid[cy][cx] == EMPTY:
                        cells.add((cx, cy))
    return cells


def grid_key(grid):
    return tuple(tuple(row) for row in grid)


def path_length(grid, sx, sy, dx, dy, receptor_type, emitter_type):
    """Count cells along beam path until wall, receptor, or edge."""
    x, y = sx + dx, sy + dy
    count = 0
    visited = set()
    while 0 <= x < GRID_SIZE and 0 <= y < GRID_SIZE:
        key = (x, y)
        if key in visited:
            break
        visited.add(key)
        cell = grid[y][x]
        if cell == WALL or cell == receptor_type or cell == emitter_type:
            break
        count += 1
        x += dx
        y += dy
    return count


def candidate_score(grid, cx, cy):
    """Score a candidate cell — prefer cells closer to receptors."""
    score = 0
    for y in range(GRID_SIZE):
        for x in range(GRID_SIZE):
            cell = grid[y][x]
            if cell == SUN_RECEPTOR or cell == MOON_RECEPTOR:
                dist = abs(cx - x) + abs(cy - y)
                score = max(score, 8 - dist)
    return score


def dfs(grid, depth, max_depth, visited):
    if check_win(grid):
        return []

    if depth >= max_depth:
        return None

    candidates = get_reachable_empty(grid)
    if not candidates:
        return None

    # Order candidates by score (closer to receptors first)
    scored = [(candidate_score(grid, cx, cy), cx, cy) for cx, cy in candidates]
    scored.sort(reverse=True)

    for score, cx, cy in scored[:12]:  # Limit branching to 12 per depth
        for mirror in (MIRROR_FWD, MIRROR_BACK):
            grid[cy][cx] = mirror
            key = grid_key(grid)
            if key not in visited:
                visited.add(key)
                result = dfs(grid, depth + 1, max_depth, visited)
                if result is not None:
                    return [(cx, cy, mirror)] + result
            grid[cy][cx] = EMPTY

    return None


def solve_level(base_grid, max_mirrors=10):
    for k in range(1, max_mirrors + 1):
        g = deepcopy(base_grid)
        visited = {grid_key(g)}
        result = dfs(g, 0, k, visited)
        if result is not None:
            return k, result
    return None, []


LEVELS = [
    {'id': 1, 'name': 'First Light', 'par': 1, 'data': [
        (1, 0, SUN_EMITTER), (3, 7, SUN_RECEPTOR)]},
    {'id': 2, 'name': 'Second Glance', 'par': 1, 'data': [
        (2, 0, SUN_EMITTER), (0, 6, SUN_RECEPTOR)]},
    {'id': 3, 'name': 'Crossroads', 'par': 2, 'data': [
        (2, 0, SUN_EMITTER), (1, 7, SUN_RECEPTOR), (2, 7, WALL)]},
    {'id': 4, 'name': 'Detour', 'par': 2, 'data': [
        (2, 0, SUN_EMITTER), (4, 6, SUN_RECEPTOR), (2, 5, WALL)]},
    {'id': 5, 'name': 'Two Shadows', 'par': 4, 'data': [
        (1, 0, SUN_EMITTER), (3, 7, SUN_RECEPTOR),
        (5, 7, MOON_EMITTER), (7, 0, MOON_RECEPTOR),
        (1, 7, WALL), (5, 0, WALL)]},
    {'id': 6, 'name': 'The Split', 'par': 4, 'data': [
        (1, 0, SUN_EMITTER), (4, 7, SUN_RECEPTOR),
        (6, 7, MOON_EMITTER), (3, 0, MOON_RECEPTOR),
        (1, 7, WALL), (6, 0, WALL)]},
    {'id': 7, 'name': 'Crossings', 'par': 4, 'data': [
        (0, 0, SUN_EMITTER), (4, 7, SUN_RECEPTOR),
        (7, 7, MOON_EMITTER), (3, 0, MOON_RECEPTOR),
        (0, 7, WALL), (7, 0, WALL), (2, 2, WALL), (5, 5, WALL)]},
    {'id': 8, 'name': 'The Divide', 'par': 4, 'data': [
        (1, 0, SUN_EMITTER), (4, 7, SUN_RECEPTOR),
        (6, 7, MOON_EMITTER), (3, 0, MOON_RECEPTOR),
        (1, 5, WALL), (1, 6, WALL), (6, 4, WALL)]},
    {'id': 9, 'name': 'The Maze', 'par': 4, 'data': [
        (0, 3, SUN_EMITTER), (7, 3, SUN_RECEPTOR),
        (7, 4, MOON_EMITTER), (0, 4, MOON_RECEPTOR)] +
        [(i, 1, WALL) for i in range(1, 6)] +
        [(i, 6, WALL) for i in range(1, 6)] +
        [(3, 2, WALL), (3, 3, WALL), (3, 4, WALL),
         (4, 3, WALL), (4, 4, WALL), (4, 5, WALL)]},
    {'id': 10, 'name': 'Solstice', 'par': 5, 'data': [
        (0, 1, SUN_EMITTER), (5, 7, SUN_RECEPTOR),
        (7, 6, MOON_EMITTER), (2, 0, MOON_RECEPTOR),
        (0, 7, WALL), (7, 0, WALL)] +
        [(r, c, WALL) for r, c in [
            (1, 2), (1, 3), (1, 4), (1, 5),
            (3, 1), (4, 1), (5, 1),
            (3, 5), (4, 5), (5, 5),
            (6, 2), (6, 3), (6, 4)]]},
    # --- MASTER LEVELS ---
    {'id': 11, 'name': "Master's Gate", 'par': 4, 'data': [
        (0, 0, SUN_EMITTER), (4, 7, SUN_RECEPTOR),
        (7, 7, MOON_EMITTER), (3, 0, MOON_RECEPTOR),
        (0, 4, WALL), (7, 3, WALL), (2, 3, WALL), (5, 4, WALL)]},
    {'id': 12, 'name': 'The Gauntlet', 'par': 4, 'data': [
        (0, 3, SUN_EMITTER), (7, 4, SUN_RECEPTOR),
        (7, 3, MOON_EMITTER), (0, 4, MOON_RECEPTOR),
        (0, 6, WALL), (7, 1, WALL)]},
    {'id': 13, 'name': 'Mirror Maze', 'par': 4, 'data': [
        (0, 0, SUN_EMITTER), (3, 7, SUN_RECEPTOR),
        (7, 7, MOON_EMITTER), (4, 0, MOON_RECEPTOR),
        (0, 4, WALL), (7, 3, WALL), (2, 3, WALL), (5, 4, WALL)]},
    {'id': 14, 'name': 'Double Cross', 'par': 5, 'data': [
        (0, 0, SUN_EMITTER), (6, 7, SUN_RECEPTOR),
        (7, 7, MOON_EMITTER), (1, 0, MOON_RECEPTOR),
        (0, 4, WALL), (7, 3, WALL), (2, 3, WALL), (5, 4, WALL)]},
    {'id': 15, 'name': 'The Crucible', 'par': 4, 'data': [
        (0, 0, SUN_EMITTER), (7, 4, SUN_RECEPTOR),
        (7, 7, MOON_EMITTER), (0, 3, MOON_RECEPTOR),
        (0, 6, WALL), (7, 1, WALL),
        (6, 4, WALL), (1, 3, WALL)]},
    # --- GRANDMASTER LEVELS ---
    {'id': 16, 'name': 'Shadow Realm', 'par': 4, 'data': [
        (0, 0, SUN_EMITTER), (3, 7, SUN_RECEPTOR),
        (7, 7, MOON_EMITTER), (4, 0, MOON_RECEPTOR),
        (0, 4, WALL), (7, 3, WALL), (2, 2, WALL), (5, 5, WALL)]},
    {'id': 17, 'name': 'The Abyss', 'par': 5, 'data': [
        (0, 0, SUN_EMITTER), (7, 7, SUN_RECEPTOR),
        (0, 7, MOON_EMITTER), (7, 0, MOON_RECEPTOR),
        (0, 3, WALL), (0, 4, WALL), (0, 5, WALL)]},
    {'id': 18, 'name': 'The Impossible', 'par': 6, 'data': [
        (0, 0, SUN_EMITTER), (7, 4, SUN_RECEPTOR),
        (7, 7, MOON_EMITTER), (0, 3, MOON_RECEPTOR),
        (0, 5, WALL), (7, 2, WALL),
        (2, 4, WALL), (5, 3, WALL)]},
]


def build_grid(entries):
    g = [[EMPTY] * GRID_SIZE for _ in range(GRID_SIZE)]
    for y, x, val in entries:
        g[y][x] = val
    return g


def print_grid(grid):
    chars = {0: '.', 1: '/', 2: '\\', 3: '#', 4: 'S',
             5: 'M', 6: 's', 7: 'm'}
    for y in range(GRID_SIZE):
        print('  ' + ''.join(chars.get(grid[y][x], '?') for x in range(GRID_SIZE)))


if __name__ == '__main__':
    for lvl in LEVELS:
        grid = build_grid(lvl['data'])
        print(f"Level {lvl['id']}: {lvl['name']} (par: {lvl['par']})")
        print_grid(grid)

        t0 = time.time()
        k, placements = solve_level(grid, max_mirrors=8)
        elapsed = time.time() - t0

        if k is not None:
            orients = []
            for cx, cy, m in placements:
                orients.append(f"{'/' if m == MIRROR_FWD else chr(92)}({cx},{cy})")
            match = "OK" if k == lvl['par'] else f"MISMATCH (stated {lvl['par']})"
            print(f"  Solved: {k} mirror(s) [{match}] in {elapsed:.1f}s")
            print(f"  {', '.join(orients)}")

            # Show solved grid
            sol = deepcopy(grid)
            for cx, cy, m in placements:
                sol[cy][cx] = m
            print_grid(sol)
        else:
            print(f"  No solution up to 8 mirrors ({elapsed:.1f}s)")
        print()
