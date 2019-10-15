auto(["/", "/index.html", "/css/(.*)", "/img/(.*)", "/js/(.*)", "/views/(.*)"]);

get("/(.*)", (req, res) => {

	res.file("index.html");

});
