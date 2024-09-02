Inside the server project folder, run the following commands:

1. Install the requirements

```bash
pip install -r requirements.txt
```

2. Setup the database

```bash
python manage.py migrate
```

3. Run the server

```bash
python manage.py runserver
```

4. Add test data, in another terminal with the server running in the background

```bash
python addData.py
```


----

## Build the executable
```
pyinstaller GardenErp.spec
```