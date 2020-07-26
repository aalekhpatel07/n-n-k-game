from math import inf
from random import shuffle
import sys
from random import randrange
from math import sqrt


class TicTacToe:
    def __init__(self, dimension, board=None):
        self.dimension = dimension
        if board:
            self.board = [[board[i][j] for j in range(self.dimension)] for i in range(self.dimension)]
        else:
            self.board = [['_' for _ in range(self.dimension)] for __ in range(self.dimension)]

        pass

    def number_of_winning_chances(self, player):

        count = 0
        target = {player, '_'}

        for i in range(self.dimension):
            if set(self.board[i]).issubset(target):
                count += 1
        for i in range(self.dimension):
            if set([self.board[j][i] for j in range(self.dimension)]).issubset(target):
                count += 1
        if set([self.board[i][i] for i in range(self.dimension)]).issubset(target):
            count += 1
        if set([self.board[i][-i] for i in range(self.dimension)]).issubset(target):
            count += 1

        return count

    def evaluate(self):
        if self.has_x_won():
            return -1000
        elif self.has_o_won():
            return 1000
        else:
            # number of rows/columns/diagonals that x can win in
            # vs number of rows/columns/diagonals that o can win in.
            x_winning = self.number_of_winning_chances(player='x')
            o_winning = self.number_of_winning_chances(player='o')
            return abs(x_winning-o_winning)*300
        pass

    def place(self, pos, val):
        assert type(pos) == int
        r, c = divmod(pos, self.dimension)
        self.board[r][c] = val

    def has_won(self, player):
        for i in range(self.dimension):
            if self.board[i] == [player for _ in range(self.dimension)]:
                return True

        for i in range(self.dimension):
            if [self.board[j][i] for j in range(self.dimension)] == [player for _ in range(self.dimension)]:
                return True

        if [self.board[i][i] for i in range(self.dimension)] == [player for _ in range(self.dimension)]:
            return True
        if [self.board[i][-i-1] for i in range(self.dimension)] == [player for _ in range(self.dimension)]:
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


def minimax_helper(board: TicTacToe, first_moves, player='o', depth=0, max_depth=18, is_maximizing=True):
    avail_indices = list(board.available_indices())

    if board.has_x_won():
        # print(board)
        return -1000, first_moves
    if board.has_o_won():
        # print(board)
        return 1000, first_moves

    if depth == max_depth or len(avail_indices) == 0:
        return board.evaluate(), first_moves

    shuffle(avail_indices)

    if is_maximizing:
        value = -inf
        for idx in avail_indices:
            if player == 'o':
                board.place(pos=idx, val='o')
                temp, first_moves = minimax_helper(
                    board=board,
                    player='x',
                    depth=depth+1,
                    max_depth=max_depth,
                    is_maximizing=False,
                    first_moves=first_moves
                )
                if temp > value:
                    value = temp
                    if depth == 1:
                        if idx in first_moves:
                            if first_moves[idx] < value:
                                first_moves[idx] = value
                        else:
                            first_moves[idx] = value

            else:
                board.place(pos=idx, val='x')
                temp, first_moves = minimax_helper(
                    board=board,
                    player='o',
                    depth=depth+1,
                    max_depth=max_depth,
                    is_maximizing=False,
                    first_moves=first_moves
                )
                if temp > value:
                    value = temp
                    if depth == 1:
                        if idx in first_moves:
                            if first_moves[idx] < value:
                                first_moves[idx] = value
                        else:
                            first_moves[idx] = value
            board.remove(idx)
        return value, first_moves
    else:
        value = inf
        for idx in avail_indices:
            if player == 'o':
                board.place(pos=idx, val='o')
                temp, first_moves = minimax_helper(
                    board=board,
                    player='x',
                    depth=depth+1,
                    max_depth=max_depth,
                    is_maximizing=True,
                    first_moves=first_moves
                )
                if temp < value:
                    value = temp
                    if depth == 1:
                        if idx in first_moves:
                            if first_moves[idx] > value:
                                first_moves[idx] = value
                        else:
                            first_moves[idx] = value
            else:
                board.place(pos=idx, val='x')
                temp, first_moves = minimax_helper(
                    board=board,
                    player='o',
                    depth=depth+1,
                    max_depth=max_depth,
                    is_maximizing=True,
                    first_moves=first_moves
                )

                if temp < value:
                    value = temp
                    if depth == 1:
                        if idx in first_moves:
                            if first_moves[idx] > value:
                                first_moves[idx] = value
                        else:
                            first_moves[idx] = value

            board.remove(idx)
        return value, first_moves


def minimax(board, to_move, max_depth=18):

    first_moves = dict()
    current = to_move
    answer, first_moves = minimax_helper(
        board=board,
        player=current,
        depth=1,
        max_depth=max_depth,
        is_maximizing=False,
        first_moves=first_moves
    )
    if len(first_moves) > 0:
        move = min(first_moves, key=lambda x: first_moves[x])
    else:
        move = -1
    if move == -1:
        return move, move
    return move, first_moves[move]


def driver():
    dimension = 3
    board = TicTacToe(dimension)
    used = set()

    while not board.is_game_complete():
        r, c = list(map(int, input('Play as O. Enter an index: ').split(' ')))
        if r == c == -1:
            break
        while not (0 <= min(r, c) <= max(r, c) <= dimension-1) or dimension*r+c in used:
            print('index invalid.')
            r, c = list(map(int, input('Play as O. Enter an index: ').split(' ')))
        if r == c == -1:
            break
        board.place(pos=dimension*r + c, val='o')
        used |= {dimension*r + c}
        print(board)
        print('You played a `O` at: ', (str(r), str(c)))

        if board.has_o_won():
            print('You win!')
            return
        if board.tie():
            print('The game has been tied!')
            return

        move, val = minimax(board, 'x')
        print(val)
        if move == -1:
            break
        board.place(pos=move, val='x')
        used |= {move}
        print(board)
        print('AI plays an X at: ', str(divmod(move, dimension)))

        if board.has_x_won():
            print('AI wins! Better luck next time.')
            return
        if board.tie():
            print('The game has been tied!')
            return


def main(board):
    ttt = TicTacToe(len(board), board=board)
    if len(board) == 3:
        move, val = minimax(ttt, 'x', max_depth=18)
    else:
        move, val = minimax(ttt, 'x', max_depth=6)
    if move == -1:
        print(-1)
        return
    r, c = divmod(move, len(board))
    print(r, c, end=' ')

    ttt.place(pos=move, val='x')
    if ttt.has_x_won():

        print('x')
    elif ttt.tie():
        print('t')
    else:
        print('i')
    return


def driver_0():
    arr = sys.argv[1].split(',')

    dimension = int(sqrt(len(arr)))

    board = [[arr[dimension*i + j] for j in range(dimension)] for i in range(dimension)]
    main(board)

    # print(arr)
    sys.stdout.flush()
    return


if __name__ == '__main__':
    driver_0()
    # main()
