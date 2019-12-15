module.exports = {
    selected: {
        note: '1a',
        category: '1c',
        type: 'notes',
    },
    editor: false,
    favourites:[

    ],
    search: '',
    transition: 'nothing',
    notes: [
        {
            created_at: Date.now(),
            updated_at: Date.now(),
            key: '1n',
            category: '1c',
            trashed_at: false,
            title: 'A New Hope',
            description: 'A short and sweet description would not harm this note',
            content: '## Double click here to start writing'
        },
        {
            created_at: Date.now(),
            updated_at: Date.now(),
            key: '2n',
            trashed_at: false,
            category: '2c',
            title: 'Obi Wan Kenobi',
            description: 'The Force will be with you. Always',
            content: '## Double click here to start writing'
        },
        {
            created_at: Date.now(),
            updated_at: Date.now(),
            key: '3n',
            trashed_at: false,
            category: '3c',
            title: 'Yoda',
            description: 'When gone am I, the last of the Jedi will you be.',
            content: ' The Force runs strong in your family. Pass on what you have learned.'
        }
    ],
    categories: [
        {
            key: '1c',
            title: 'A new hope',
            disabled: true,
            trashed_at: false,
            created_at: Date.now(),
            updated_at: Date.now()
        },
        {
            key: '2c',
            title: 'Empite Strikes Back',
            disabled: true,
            trashed_at: false,
            created_at: Date.now(),
            updated_at: Date.now()
        },
        {
            key: '3c',
            title: 'The Return of the Jedi',
            disabled: true,
            trashed_at: false,
            created_at: Date.now(),
            updated_at: Date.now()
        }
    ]
}