const API_ROOT = `http://${location.hostname}/api`;

const ARTICLE_TEMPLATE = "gpi4ir8nujp";

const cache = {};
const routes = {

	"/": {

		view: "index.ejs"

	},

	"/about": {

		view: "about.ejs"

	},

	"/politics": {

		view: "politics.ejs"

	},

	"/article/*": {

		view: "article.ejs"

	}

}

async function render (view, data) {

	data = {

		...data,

		render,

		url (url) {

			if (url.startsWith("/")) return `https://${location.hostname}/api/file${url}`;
			else return url;

		},

		posts: {

			all () {

				return elements.filter(_ => _.template === ARTICLE_TEMPLATE);

			},

			category (category) {

				return this.all().filter(_ => _.fields.categories.split(",").map(__ => __.trim().toLowerCase()).indexOf(category.toLowerCase()) !== -1);

			},

			slug (slug) {

				return this.all().find(_ => _.fields.slug.toLowerCase() === slug.toLowerCase());

			}

		},

		sortByDate (arr) {

			return arr.sort((a, b) => new Date(b.fields.release_date) - new Date(a.fields.release_date));

		}

	}

	const view_data = cache[view] || await (await fetch(`/views/${view}`)).text();

	cache[view] = view_data;

	return ejs.render(view_data, data, {

		async: true

	});

}

// Router

function currentRoute () {

	if (location.pathname.replace("/", "")) return location.pathname + ((!location.search && location.href.indexOf("?") !== -1) ? "?" : location.search);
	else return location.hash.replace("#", "") ? (location.hash.replace("#", "").endsWith("/") && location.hash.replace("#", "").length > 3 ? location.hash.replace("#", "").slice(0, -1) : location.hash.replace("#", "")) : "/";

}

// All together now

function currentRouteData () {

	// Checks if currentRoute is equal to any routes
	// Also checks if a route ends with * and that the route it is compared too matches the beginning of the route (eg. /post/* and /post/potatoes_are_tasty)
	for (const route of Object.keys(routes)) if (route === currentRoute() || (route.endsWith("*") && currentRoute().startsWith(route.slice(0, route.length - 1)))) return routes[route];

}

async function load () {

	const root = document.getElementById("app");
	console.log(`On ${currentRoute()}`);

	if (currentRouteData()) {

		try {

			document.title = "The Snitch";
			root.innerHTML = await render(currentRouteData().view);

		} catch (e) {

			root.innerHTML = await render("404.ejs");
			throw e;

		}

	} else {

		root.innerHTML = await render("404.ejs");

		console.log("Invalid page.");

	}

	for (const script of root.querySelectorAll("script")) {

		const s = document.createElement("script");

		s.src = script.src;
		s.innerHTML = script.innerHTML;

		script.parentElement.appendChild(s);
		script.remove();

	}

}

async function main () {

	elements = (await (await fetch(`${API_ROOT}/elements`)).json());

	load();

	document.addEventListener("click", event => {

		if (!event.target) return;

		const a = event.target.href ? event.target : event.target.closest("a[href]");

		if (a && a.href && (a.href.startsWith("/") || a.href.indexOf(location.origin) !== -1)) {

			history.pushState(null, null, a.href);
			load();

			event.preventDefault();
			return false;

		}

		if (event.target.parentElement && event.target.parentElement.classList.contains("dots")) {

			const index = [...event.target.parentElement.children].indexOf(event.target);

			event.target.parentElement.querySelector(".selected").classList.remove("selected");
			event.target.classList.add("selected");

			event.target.parentElement.parentElement.querySelector(".current_slide").classList.remove("current_slide");
			event.target.parentElement.parentElement.children[index].classList.add("current_slide");

		}

	});

	window.addEventListener("hashchange", load);

}

main();
