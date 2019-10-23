auto(["/", "/index.html", "/css/(.*)", "/img/(.*)", "/js/(.*)", "/views/(.*)"]);

const utils = API_ROOT => ({

	url (url) {

		if (url.startsWith("/")) return `${API_ROOT}/file${url}`;
		else return url;

	},

	pages: {

		all () {

			return db.elements.accessible().filter(_ => db.templates.templateNameFromId(_.template) === "Page");

		},

		title (title) {

			return this.all().find(_ => _.fields.title.toLowerCase() === title.toLowerCase());

		}

	},

	posts: {

		all () {

			return db.elements.accessible().filter(_ => db.templates.templateNameFromId(_.template) === "Article");

		},

		category (category) {

			return this.all().filter(_ => _.fields.categories.split(",").map(__ => __.trim().toLowerCase()).indexOf(category.toLowerCase()) !== -1);

		},

		slug (slug) {

			return this.all().find(_ => _.fields.slug.toLowerCase() === slug.toLowerCase());

		}

	},

	profiles: {

		all () {

			return db.elements.accessible().filter(_ => db.templates.templateNameFromId(_.template) === "Profile");

		},

		role (role) {

			return this.all().filter(_ => _.fields.role === role);

		}

	},

	sortByDate (arr) {

		return arr.sort((a, b) => new Date(b.fields.release_date) - new Date(a.fields.release_date));

	},

	capitalize (string) {

		return string.slice(0, 1).toUpperCase() + string.slice(1);

	}

});

const standard = req => ({

	...utils(`https://${req.hostname}/api`),

	params: req.params,

	seo: {

		url: `https://${req.hostname}${req.url}`,
		title: "The Snitch",
		image: "https://snitchbcc.com/img/favicon.png",
		description: "The Snitch is a very legitimate news publication"

	}

});

// Error Handlers

error((req, res) => {

	res.status(500).ejs("views/404.ejs", standard(req));

});

notFound((req, res) => {

	res.status(404).ejs("views/404.ejs", standard(req));

});

// Routes

get("/", (req, res) => {

	res.status(200).ejs("views/index.ejs", standard(req));

});

get("/about", (req, res) => {

	res.status(200).ejs("views/about.ejs", standard(req));

});

get("/advice", (req, res) => {

	res.status(200).ejs("views/advice.ejs", standard(req));

});

get("/local", (req, res) => {

	res.status(200).ejs("views/local.ejs", standard(req));

});

get("/politics", (req, res) => {

	res.status(200).ejs("views/politics.ejs", standard(req));

});

get("/culture", (req, res) => {

	res.status(200).ejs("views/culture.ejs", standard(req));

});

get("/contact", (req, res) => {

	res.status(200).ejs("views/contact.ejs", standard(req));

});

get("/article/:slug", (req, res) => {

	res.status(200).ejs("views/article.ejs", standard(req));

});
