.PHONY: test lint validate-config routing-check aln-functions-sanity ci runtime-stub clean

test: lint validate-config routing-check aln-functions-sanity intent-bundle-test

lint:
	npm test

validate-config:
	npm --prefix ci-tools run validate-config

routing-check:
	node tests/idechat-routing-consistency.mjs

aln-functions-sanity:
	node tests/aln_functions_sanity.mjs

intent-bundle-test:
	npm run test-intent-bundle

runtime-stub:
	cd examples/runtime-stub && ./run-runtime-stub.sh

clean:
	rm -rf node_modules ci-tools/node_modules

ci: test
	@echo '✅ IDE-Chat local CI checks passed'