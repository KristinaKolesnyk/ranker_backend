const { readFileSync } = require('fs');
const { join } = require('path');

const handleSignup = (req, res, db, bcrypt) => {
    const { email, password, name } = req.body;

    // Проверка обязательных полей
    if (!email || !password || !name) {
        return res.status(400).json('Please provide all required fields.');
    }

    // Хеширование пароля
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({ hash, email })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name,
                        joined: new Date()
                    })
                    .then(user => {
                        const userId = user[0].id;

                        // Добавление стандартных данных
                        return addDefaultDataForUser(trx, userId)
                            .then(() => {
                                trx.commit(); // Завершение транзакции
                                res.json(user[0]);
                            })
                            .catch(err => {
                                trx.rollback(); // Откат транзакции при ошибке
                                console.error('Error adding default data:', err);
                                res.status(500).json('Error adding default data.');
                            });
                    })
                    .catch(err => {
                        trx.rollback(); // Откат транзакции при ошибке
                        console.error('Error inserting user:', err);
                        res.status(500).json('Error inserting user.');
                    });
            })
            .catch(err => {
                trx.rollback(); // Откат транзакции при ошибке
                console.error('Error inserting login:', err);
                res.status(500).json('Error inserting login.');
            });
    })
        .catch(err => {
            console.error('Transaction error:', err);
            res.status(500).json('Transaction error.');
        });
};

const addDefaultDataForUser = (trx, userId) => {
    // Чтение данных из файла
    const filePath = join(__dirname, '..', 'data', 'defaultData.json');
    const defaultData = JSON.parse(readFileSync(filePath, 'utf8'));

    return trx('collection')
        .returning('id')
        .insert({ user_id: userId })
        .then(collectionId => {
            const collection_id = collectionId[0].id;

            // Вставляем категории и получаем их ID
            const categoryPromises = Object.keys(defaultData.itemsByCategory).map(categoryName => {
                return trx('category')
                    .returning('id')
                    .insert({
                        name: categoryName,
                        collection_id
                    })
                    .then(categoryId => {
                        const category_id = categoryId[0].id;

                        // Вставляем критерии и получаем их ID
                        const criteria = defaultData.criteriaByCategory[categoryName];
                        const criteriaInsertPromises = criteria.map(criterion =>
                            trx('criterion')
                                .returning('id')
                                .insert({
                                    name: criterion,
                                    category_id
                                })
                                .then(criterionId => {
                                    return {
                                        criterion_id: criterionId[0].id,
                                        category_id
                                    };
                                })
                        );

                        // Вставляем элементы и связываем их с критериями
                        const items = defaultData.itemsByCategory[categoryName];
                        const itemInsertPromises = items.map(item =>
                            trx('item')
                                .returning('id')
                                .insert({
                                    name: item.name,
                                    url: item.URL, // Исправлено на 'url'
                                    category_id
                                })
                                .then(itemId => {
                                    const item_id = itemId[0].id;

                                    // Вставляем рейтинги, используя ID критериев
                                    return Promise.all(
                                        criteriaInsertPromises.map((criterionPromise, index) =>
                                            criterionPromise.then(criterionData =>
                                                trx('rating')
                                                    .insert({
                                                        value: item.criterions[index],
                                                        item_id,
                                                        criterion_id: criterionData.criterion_id
                                                    })
                                            )
                                        )
                                    );
                                })
                        );

                        return Promise.all(itemInsertPromises);
                    });
            });

            return Promise.all(categoryPromises);
        });
};
module.exports = {
    handleSignup: handleSignup
};