from math import inf, floor, log10
from random import shuffle
from random import sample
from random import randint

class TicTacToe:
    def __init__(self, dimension, board=None, streak=None):
        if streak is None:
            self.streak = dimension
        else:
            self.streak = streak
        self.dimension = dimension
        if board:
            self.board = [[board[i][j] for j in range(self.dimension)] for i in range(self.dimension)]
        else:
            self.board = [['_' for _ in range(self.dimension)] for __ in range(self.dimension)]
        pass

    def transpose(self):
        t = [[self.board[j][i] for j in range(self.dimension)] for i in range(self.dimension)]
        return t

    def is_valid(self):
        x_count = 0
        o_count = 0
        for i in range(self.dimension):
            for j in range(self.dimension):
                if self.board[i][j] == 'o':
                    o_count += 1
                elif self.board[i][j] == 'x':
                    x_count += 1
        return abs(o_count - x_count) <= 1 and not(self.has_o_won() and self.has_x_won())

    def number_of_winning_chances(self, player):
        count = 0
        _m = self.streak
        _d = self.dimension

        # Count all strips of the board
        # where player could possibly win.

        target = {player, '_'}

        # check top-left -> bottom-right diagonals.
        for i in range(_m - 1, _d):
            for j in range(_m - 1, _d):
                strip = [self.board[i - k][j - k] for k in range(_m)]
                if set(strip).issubset(target):
                    count += 1

        # check top-right -> bottom-left diagonals.
        for i in range(_m - 1, _d):
            for j in range(0, _d - _m + 1):
                strip = [self.board[i - k][j + k] for k in range(_m)]
                if set(strip).issubset(target):
                    count += 1

        # all diagonals checked.

        # check all rows.

        for i in range(_d):
            for j in range(_d - _m + 1):
                strip = self.board[i][j:j + _m]
                if set(strip).issubset(target):
                    count += 1

        # Check cols.
        tp = self.transpose()

        # Instead check rows in transpose.
        for i in range(_d):
            for j in range(_d - _m + 1):
                strip = tp[i][j:j + _m]
                if set(strip).issubset(target):
                    count += 1

        return count

    def evaluate(self):
        if self.has_x_won():
            return -10
        elif self.has_o_won():
            return 10
        else:
            return 0
        pass

    def place(self, pos, val):
        assert type(pos) == int
        r, c = divmod(pos, self.dimension)
        self.board[r][c] = val

    def has_won(self, player):
        _m = self.streak
        _d = self.dimension

        target = [player for _ in range(_m)]

        # check top-left -> bottom-right diagonals.
        for i in range(_m - 1, _d):
            for j in range(_m - 1, _d):
                strip = [self.board[i-k][j-k] for k in range(_m)][::-1]
                if strip == target:
                    return True

        # check top-right -> bottom-left diagonals.
        for i in range(_m - 1, _d):
            for j in range(0, _d - _m + 1):
                strip = [self.board[i-k][j+k] for k in range(_m)][::-1]
                if strip == target:
                    return True

        # all diagonals checked.

        # check all rows.

        for i in range(_d):
            for j in range(_d - _m + 1):
                strip = self.board[i][j:j+_m]
                if strip == target:
                    return True

        # Check cols.
        tp = self.transpose()

        # Instead check rows in transpose.
        for i in range(_d):
            for j in range(_d - _m + 1):
                strip = tp[i][j:j+_m]
                if strip == target:
                    return True

        return False

    def has_x_won(self):
        return self.has_won(player='x')

    def has_o_won(self):
        return self.has_won(player='o')

    def available_indices(self):
        idx = set()
        for i in range(self.dimension):
            for j in range(self.dimension):
                if self.board[i][j] == '_':
                    idx |= {i*self.dimension + j}
        return idx

    def get_best_move_x(self, max_depth=None):
        if self.is_game_complete():
            if self.has_o_won():
                return -2
            elif self.has_x_won():
                return -3
            elif self.tie():
                return -4
            return -1
        alpha = -inf
        beta = inf
        bestMoves = dict()
        if max_depth is None:
            max_depth = max(3, floor(0.5*(6 / log10(self.dimension))))
            if self.dimension > 4:
                max_depth = 2
            if self.dimension > 6:
                max_depth = 1
        for c in self.available_indices():
            self.place(pos=c, val='x')
            val = self.minimax_helper(alpha, beta, depth=max_depth, is_maximizing=True, max_depth=max_depth)
            self.remove(pos=c)
            bestMoves[c] = val
        print(bestMoves)
        return min(bestMoves, key=lambda x: bestMoves[x])

    def tie(self):
        return not self.has_o_won() and not self.has_x_won() and len(self.available_indices()) == 0

    def is_game_complete(self):
        return self.has_o_won() or self.has_x_won() or len(self.available_indices()) == 0

    def remove(self, pos):
        r, c = divmod(pos, self.dimension)
        assert 0 <= min(r, c) <= max(r, c) < self.dimension
        self.board[r][c] = '_'

    def __str__(self):
        res = ''
        for i in range(self.dimension):
            for j in range(self.dimension):
                res += self.board[i][j] + ' '
            res += '\n'
        return res

    def minimax_helper(self, alpha, beta, depth=18, is_maximizing=True, max_depth=18):
        avail_indices = list(self.available_indices())
        if depth == 0 or self.is_game_complete() or len(avail_indices) == 0:
            ev = self.evaluate()
            return ev

        if is_maximizing:
            value = -inf
            for idx in avail_indices:
                self.place(pos=idx, val='o')
                temp = self.minimax_helper(
                    alpha=alpha,
                    beta=beta,
                    depth=depth-1,
                    is_maximizing=False,
                    max_depth=max_depth
                )
                value = max(value, temp)
                alpha = max(alpha, temp)
                self.remove(idx)

                if beta <= alpha:
                    break

            if value != 0:
                return value - (max_depth-depth)
            return value
        else:
            value = inf
            for idx in avail_indices:
                self.place(pos=idx, val='x')
                temp = self.minimax_helper(
                    alpha=alpha,
                    beta=beta,
                    depth=depth-1,
                    max_depth=max_depth,
                    is_maximizing=True
                )
                value = min(value, temp)
                beta = min(beta, temp)
                self.remove(idx)
                if beta <= alpha:
                    break

            if value != 0:
                return value + (max_depth-depth)
            return value


def main_driver(board, streak, depth=None):
    ttt = TicTacToe(len(board), board=board, streak=streak)
    move = ttt.get_best_move_x(depth)

    if move < 0:
        result = '-1 -1 '
        if move == -2:
            result += 'o'
        elif move == -3:
            result += 'x'
        elif move == -4:
            result += 't'
        else:
            result += 'i'
        return result

    r, c = divmod(move, len(board))
    result = f'{str(r)} {str(c)} '

    ttt.place(pos=move, val='x')
    if ttt.has_x_won():
        result += 'x'
    elif ttt.tie():
        result += 't'
    elif ttt.has_o_won():
        result += 'o'
    else:
        result += 'i'
    return result


def generate_helper(board, dim, i, j, count, streak):
    if i == dim - 1 and j == dim:
        ttt = TicTacToe(dimension=dim, board=board, streak=streak)
        if ttt.is_valid():
            count['distinct'] += 1
            if ttt.has_x_won():
                count['x'] += 1
                print(f'{count["distinct"]: 02d}: x wins in: \n')
                print(ttt)
            elif ttt.has_o_won():
                count['o'] += 1
                print(f'{count["distinct"]: 02d}: o wins in: \n')
                print(ttt)
            elif ttt.tie():
                count['tie'] += 1
                print(f'{count["distinct"]: 02d}: game tied in: \n')
                print(ttt)
            # print(ttt)
        return False
    elif j == dim:
        generate_helper(board, dim, i+1, 0, count, streak)
    else:
        for p in ['x', 'o']:
            if board[i][j] == '_':
                board[i][j] = p
                if generate_helper(board, dim, i, j+1, count, streak):
                    return True
                board[i][j] = '_'
    return False


def generate(dim, streak):
    board = [['_' for _ in range(dim)] for _ in range(dim)]
    count = {'distinct': 0, 'o': 0, 'x': 0, 'tie': 0}
    generate_helper(board, dim, 0, 0, count, streak)
    print(count)
    pass


if __name__ == '__main__':
    pass
