const LIVE = false;

document.addEventListener("DOMContentLoaded", async () => {
	const coins = await fetch("./coins.json").then((res) => res.json());

	let data = await fetch_data(Object.keys(coins));

	Object.entries(coins).forEach((item) => {
		if (data[item[0]] != null) {
			data[item[0]].abrv = item[1];
		}
	});

	Object.entries(data).filter((item) => item[1] != null);

	let list_container = document.getElementsByClassName("list-group")[0];
	list_container.innerHTML = (
		await Promise.all(
			Object.entries(data).map(async function (coin) {
				const coin_name =
					coin[0][0].toUpperCase() + coin[0].substring(1);
				const coin_info = coin[1];
				const eur =
					coin_info.eur % 1
						? coin_info.eur.toFixed(2)
						: coin_info.eur;
				const change = coin_info.eur_24h_change.toFixed(3);
				const shorthand = coin_info.abrv;
				const img_url = await fetch(
					`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/${shorthand.toLowerCase()}.svg`
				).then((res) =>
					res.ok
						? res.url
						: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg"
				);

				return `
        <div class="p-3 m-0 d-flex flex-row gap-3 list-group-item border-0 rounded-5 w-100 ${
			change < 0 ? "falling" : "rising"
		}">
            <img class="row coin-icon m-0"
                src=${img_url}
                alt="${coin_name}">

            <div class="coin-name d-flex flex-column flex-start align-items-start justify-content-between gap-2 m-0">
                <h2 >${coin_name}</h2>
                <span class="text-secondary">${shorthand}</span>
            </div>

            <div class="coin-price d-flex flex-column flex-end ms-auto align-items-end justify-content-between gap-2">
                <span class="price">${eur} €</span>
                <span class="" >${change}</span>
            </div>
        </div>`;
			})
		)
	).join("\n");
});

async function fetch_data(coins) {
	if (LIVE) {
		return fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${coins
				.map((item) => item.toLowerCase())
				.join("%2C")}&vs_currencies=eur&include_24hr_change=true`
		).then((res) => res.json());
	} else {
		return {
			bitcoin: {
				eur: 26315,
				eur_24h_change: -2.0852477181356157,
			},
			cardano: {
				eur: 0.276584,
				eur_24h_change: -2.1334472008313696,
			},
			dogecoin: {
				eur: 0.069523,
				eur_24h_change: 7.217545426804349,
			},
			ethereum: {
				eur: 1667.81,
				eur_24h_change: -1.0096064296509362,
			},
			solana: {
				eur: 21.25,
				eur_24h_change: -3.960973135758108,
			},
			tether: {
				eur: 0.902468,
				eur_24h_change: 0.42178811811227435,
			},
		};
	}
}
