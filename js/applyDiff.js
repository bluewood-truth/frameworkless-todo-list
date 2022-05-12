export const applyDiff = ($parent, $real, $virtual) => {
	if ($real && !$virtual) {
		$real.remove();
		return;
	}

	if (!$real && $virtual) {
		$parent.appendChild($virtual);
		return;
	}

	if (isChanged($real, $virtual)) {
		$real.replaceWith($virtual);
		return;
	}

	const $realChildren = Array.from($real.children);
	const $virtualChildren = Array.from($virtual.children);

	const length = Math.max($realChildren.length, $virtualChildren.length);

	for (let i = 0; i < length; i++) {
		applyDiff($real, $realChildren[i], $virtualChildren[i]);
	}
};

const isChanged = ($a, $b) => {
	const attrsA = $a.attributes;
	const attrsB = $b.attributes;

	if (attrsA.length !== attrsB.length) return true;

	const differentAttr = Array.from(attrsA).find((attr) => {
		const { name } = attr;

		return attrsA[name].value !== attrsB[name].value;
	});

	if (differentAttr) return true;

	if (
		$a.children.length === 0 &&
		$b.children.length === 0 &&
		$a.textContent !== $b.textContent
	) {
		return true;
	}

	return false;
};
