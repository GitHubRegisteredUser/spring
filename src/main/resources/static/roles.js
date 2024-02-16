const roleFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    getAllRoles: async () => await fetch('api/admin/roles', {
        method: 'GET',
        headers: roleFetchService.head
    })
}
