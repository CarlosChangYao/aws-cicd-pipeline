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


def test_fee_never_exceeds_undiscounted():
    """業務規則：折扣後的手續費，不可能高於未折扣的原價。

    這條測試守的不是程式碼，是業務邏輯——
    如果有人把折扣誤設成 1.5（15 折），這裡會擋下來。
    """
    from app import FEE_DISCOUNT, FEE_RATE, MONTHLY_AMOUNT, calc_fee

    assert calc_fee() <= MONTHLY_AMOUNT * FEE_RATE
    assert 0 < FEE_DISCOUNT <= 1


def test_order_limit_never_exceeds_normal():
    """風控規則：現行委託上限不得高於平時上限。

    萬一有人把 100000 誤打成 1000000（多一個零），
    等於偷偷把風險敞口放大十倍——這條測試會直接擋在上線之前。
    """
    from app import NORMAL_ORDER_LIMIT, ORDER_LIMIT

    assert 0 < ORDER_LIMIT <= NORMAL_ORDER_LIMIT
