"""關 2 的 pipeline 會跑這些測試，測試不過就不准上線。

檢核點 #12 要求「故意寫錯測試，展示 pipeline 紅燈中止」——
到時候把 test_healthz 裡的 200 改成 201，push 上去就會看到 Actions 變紅。
"""

from app import app


def test_index_returns_200():
    client = app.test_client()
    resp = client.get("/")
    assert resp.status_code == 200


def test_index_shows_version():
    client = app.test_client()
    resp = client.get("/")
    assert b"NKC202" in resp.data


def test_healthz():
    client = app.test_client()
    resp = client.get("/healthz")
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "ok"
