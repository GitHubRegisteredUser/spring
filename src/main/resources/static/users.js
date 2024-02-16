const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    getAllUsers: async () => await fetch('/api/admin/users', {
        method: 'GET',
        headers: userFetchService.head
    }),
    getUser: async (id) => await fetch(`/api/admin/users/${id}`, {
        method: 'GET',
        headers: userFetchService.head,
    }),
    saveUser: async (user) => await fetch('/api/admin/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: userFetchService.head
    }),
    getCurrentUser: async () => await fetch(`/api/user`, {
        method: 'GET',
        headers: userFetchService.head,
    })
}
