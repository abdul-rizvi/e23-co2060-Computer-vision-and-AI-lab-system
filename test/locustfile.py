from locust import HttpUser, task, between

class APIUser(HttpUser):
    wait_time = between(1, 2.5)

    @task
    def health_check(self):
        self.client.get("/")

    @task(3)
    def get_inventory(self):
        self.client.get("/api/items")

    @task(2)
    def get_news(self):
        self.client.get("/api/news")

    @task(2)
    def get_projects(self):
        self.client.get("/api/projects")
        
    @task(1)
    def get_people(self):
        self.client.get("/api/people")
