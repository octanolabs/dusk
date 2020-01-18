export default function({ store, redirect }) {
  // If the user is authenticated
  if (store.state.autheticated === true) {
    return redirect('/dashboard')
  }
}
