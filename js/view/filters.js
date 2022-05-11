export const filtersView = ($target, { currFilter }) => {
	const $filters = $target.cloneNode(true);
	$filters.querySelectorAll("li a").forEach(($a) => {
		if ($a.textContent === currFilter) {
			$a.classList.add("selected");
		} else {
			$a.classList.remove("selected");
		}
	});

	return $filters;
};
