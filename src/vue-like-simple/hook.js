export function callHooks( vm, hookName ) {
  if ( vm._options[ hookName ] && typeof vm._options[hookName] === "function") {
    vm._options[ hookName ].call( vm )
  }
}
export function noop() {

}

