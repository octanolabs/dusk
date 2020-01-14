export default function({ store, redirect }) {
  // If the user is authenticated
  if (store.state.authUser) {
    return redirect('/dashboard')
  }
}
