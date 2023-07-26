let turn = 1;

// This could be dynamically changed from the view
// I'm to lazy to do it right now
const board_dimension = 3;
let board = [...Array(board_dimension)].map(() =>
	Array(board_dimension).fill(0)
);

document.addEventListener("DOMContentLoaded", async () => {
	let players = await fetch("./players.json").then((res) => res.json());

	const num_players = players.length;
	const board_elem = document.getElementById("board");

	board_elem.innerHTML = gen_board_elem(board_dimension);

	const cells = Array.from(document.getElementsByClassName("cell"));
	cells.forEach((cell, idx) => {
		cell.addEventListener("click", () => {
			if (cell.innerHTML != "") {
				return;
			}

			const color = players[turn - 1].color;
			cell.style.cssText += `color: ${color}`;

			board[Math.floor(idx / board_dimension)][idx % board_dimension] =
				turn;
			cell.innerHTML = players[turn - 1].mark;
			turn = switch_turn(turn, num_players);

			document.documentElement.style.setProperty(
				"--highlight-bg",
				players[turn - 1].color
			);

			const board_winner = is_solved(board);
			if (board_winner == -1) {
				show_modal(-1, "var(--text-color)");
			} else if (board_winner != 0) {
				show_modal(board_winner, color);
			}
		});
	});
});

function show_modal(user, color) {
	const modal_content = document.getElementsByClassName("modal-body")[0];
	modal_content.innerHTML = `<b style="color: ${color}"> ${
		user == -1 ? `It's a tie!` : `Player ${user} won!`
	}</b>`;

	const staticBackdropModal = new bootstrap.Modal(
		document.getElementById("staticBackdrop")
	);
	staticBackdropModal.show();
}

function switch_turn(curr_turn, num_users) {
	return (curr_turn % num_users) + 1;
}

function gen_board_elem(board_dimension) {
	const row =
		`<div class="cell float-start rounded-3 w-100 h-100 d-flex align-items-center justify-content-center"></div>`.repeat(
			board_dimension
		);

	const board = `<div class="d-flex flex-row gap-3">
		${row}
		</div>`.repeat(board_dimension);

	return board;
}

function is_solved(board) {
	const players = [...new Set(board.flat())].filter((value) => value != 0);

	const check_line = (line, mark) => line.every((cell) => cell == mark);

	const winning_row_player = players.find((player) =>
		board.some((row) => check_line(row, player))
	);

	if (winning_row_player != undefined) {
		return winning_row_player;
	}

	const transposed_board = board[0].map((_, idx) =>
		board.map((row) => row[idx])
	);

	const winning_col_player = players.find((player) =>
		transposed_board.some((row) => check_line(row, player))
	);

	if (winning_col_player != undefined) {
		return winning_col_player;
	}

	const diagonal = board.map((row, idx) => row[idx]);
	const anti_diagonal = board.map((row, idx) => row[board.length - 1 - idx]);

	const winning_diagonal_player = players.find(
		(player) =>
			diagonal.every((cell) => cell == player) ||
			anti_diagonal.every((cell) => cell == player)
	);

	if (winning_diagonal_player != undefined) {
		return winning_diagonal_player;
	}

	if (board.flat().every((cell) => cell != 0)) {
		return -1;
	}

	return 0;
}
