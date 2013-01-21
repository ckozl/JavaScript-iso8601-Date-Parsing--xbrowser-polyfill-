/*\
|*|	
|*|	polyfilling the subset of iso8601 dates used by JavaScript (ECMAScript-262 v5.1)
|*|	- ck 02/07/2012 
|*|	- ck 01/21/2013 - updated with stuff about the upcoming ES6.0 shift (see other version of this file)
|*|	testing ground: http://jsbin.com/akagim/10
|*|		ref:
|*|			http://dev.w3.org/html5/spec/common-microsyntaxes.html
|*|			http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15
|*|			http://msdn.microsoft.com/en-us/library/windows/apps/ff743760(v=vs.94).aspx
|*|			http://msdn.microsoft.com/en-us/library/windows/apps/wz6stk2z(v=vs.94).aspx
|*|			http://msdn.microsoft.com/en-us/library/windows/apps/k4w173wk(v=vs.94).aspx
|*|			https://connect.microsoft.com/IE/feedback/details/723740/date-parse-and-new-date-fail-on-valid-formats
|*|	
\*/

(function() {

	var d = window.Date,
		regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,3})(?:Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

	if (d.parse('2011-11-29T15:52:30.5') !== 1322581950500 ||
		d.parse('2011-11-29T15:52:30.52') !== 1322581950520 ||
		d.parse('2011-11-29T15:52:18.867') !== 1322581938867 ||
		d.parse('2011-11-29T15:52:18.867Z') !== 1322581938867 ||
		d.parse('2011-11-29T15:52:18.867-03:30') !== 1322594538867 ||
		d.parse('2011-11-29') !== 1322524800000 ||
		d.parse('2011-11') !== 1320105600000 ||
		d.parse('2011') !== 1293840000000) {

		d.__parse = d.parse;

		d.parse = function(v) {

			var m = regexIso8601.exec(v);

			if (m) {
				return Date.UTC(
					m[1],
					(m[2] || 1) - 1,
					m[3] || 1,
					m[4] - (m[8] ? m[8] + m[9] : 0) || 0,
					m[5] - (m[8] ? m[8] + m[10] : 0) || 0,
					m[6] || 0,
					((m[7] || 0) + '00').substr(0, 3)
				);
			}

			return d.__parse.apply(this, arguments);

		};
	}

	d.__fromString = d.fromString;

	d.fromString = function(v) {

		if (!d.__fromString || regexIso8601.test(v)) {
			return new d(d.parse(v));
		}

		return d.__fromString.apply(this, arguments);
	};

})();
