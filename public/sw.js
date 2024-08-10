!(function () {
  var e, t;
  let a, s, i, n, r;
  const o = {
      googleAnalytics: "googleAnalytics",
      precache: "precache-v2",
      prefix: "serwist",
      runtime: "runtime",
      suffix: "undefined" != typeof registration ? registration.scope : "",
    },
    c = (e) =>
      [o.prefix, e, o.suffix].filter((e) => e && e.length > 0).join("-"),
    l = (e) => {
      for (const t of Object.keys(o)) e(t);
    },
    h = {
      updateDetails: (e) => {
        l((t) => {
          const a = e[t];
          "string" == typeof a && (o[t] = a);
        });
      },
      getGoogleAnalyticsName: (e) => e || c(o.googleAnalytics),
      getPrecacheName: (e) => e || c(o.precache),
      getPrefix: () => o.prefix,
      getRuntimeName: (e) => e || c(o.runtime),
      getSuffix: () => o.suffix,
    },
    u = (e, ...t) => {
      let a = e;
      return t.length > 0 && (a += ` :: ${JSON.stringify(t)}`), a;
    };
  class d extends Error {
    details;
    constructor(e, t) {
      super(u(e, t)), (this.name = e), (this.details = t);
    }
  }
  const f = new Set();
  async function p(e, t) {
    let s = null;
    if ((e.url && (s = new URL(e.url).origin), s !== self.location.origin))
      throw new d("cross-origin-copy-response", { origin: s });
    const i = e.clone(),
      n = {
        headers: new Headers(i.headers),
        status: i.status,
        statusText: i.statusText,
      },
      r = t ? t(n) : n,
      o = !(() => {
        if (void 0 === a) {
          const e = new Response("");
          if ("body" in e)
            try {
              new Response(e.body), (a = !0);
            } catch (e) {
              a = !1;
            }
          a = !1;
        }
        return a;
      })()
        ? await i.blob()
        : i.body;
    return new Response(o, r);
  }
  class m {
    promise;
    resolve;
    reject;
    constructor() {
      this.promise = new Promise((e, t) => {
        (this.resolve = e), (this.reject = t);
      });
    }
  }
  function g(e, t) {
    const a = new URL(e);
    for (const e of t) a.searchParams.delete(e);
    return a.href;
  }
  async function w(e, t, a, s) {
    const i = g(t.url, a);
    if (t.url === i) return e.match(t, s);
    const n = { ...s, ignoreSearch: !0 };
    for (const r of await e.keys(t, n))
      if (i === g(r.url, a)) return e.match(r, s);
  }
  function y(e) {
    e.then(() => {});
  }
  async function _() {
    for (const e of f) await e();
  }
  const b = (e) =>
    new URL(String(e), location.href).href.replace(
      RegExp(`^${location.origin}`),
      "",
    );
  function v(e) {
    return new Promise((t) => setTimeout(t, e));
  }
  async function x(e) {
    let t;
    if (!e) return;
    let a = await self.clients.matchAll({ type: "window" }),
      s = new Set(a.map((e) => e.id)),
      i = performance.now();
    while (
      performance.now() - i < 2e3 &&
      !(t = (a = await self.clients.matchAll({ type: "window" })).find((t) =>
        e ? t.id === e : !s.has(t.id),
      ))
    )
      await v(100);
    return t;
  }
  function R(e, t) {
    const a = t();
    return e.waitUntil(a), a;
  }
  let E = (e, t) => t.some((t) => e instanceof t),
    S = new WeakMap(),
    q = new WeakMap(),
    C = new WeakMap(),
    D = {
      get(e, t, a) {
        if (e instanceof IDBTransaction) {
          if ("done" === t) return S.get(e);
          if ("store" === t)
            return a.objectStoreNames[1]
              ? void 0
              : a.objectStore(a.objectStoreNames[0]);
        }
        return N(e[t]);
      },
      set: (e, t, a) => ((e[t] = a), !0),
      has: (e, t) =>
        (e instanceof IDBTransaction && ("done" === t || "store" === t)) ||
        t in e,
    };
  function N(e) {
    var t;
    if (e instanceof IDBRequest)
      return ((e) => {
        const t = new Promise((t, a) => {
          const s = () => {
              e.removeEventListener("success", i),
                e.removeEventListener("error", n);
            },
            i = () => {
              t(N(e.result)), s();
            },
            n = () => {
              a(e.error), s();
            };
          e.addEventListener("success", i), e.addEventListener("error", n);
        });
        return C.set(t, e), t;
      })(e);
    if (q.has(e)) return q.get(e);
    const a =
      "function" == typeof (t = e)
        ? (
            i ||
            (i = [
              IDBCursor.prototype.advance,
              IDBCursor.prototype.continue,
              IDBCursor.prototype.continuePrimaryKey,
            ])
          ).includes(t)
          ? function (...e) {
              return t.apply(k(this), e), N(this.request);
            }
          : function (...e) {
              return N(t.apply(k(this), e));
            }
        : (t instanceof IDBTransaction &&
              ((e) => {
                if (S.has(e)) return;
                const t = new Promise((t, a) => {
                  const s = () => {
                      e.removeEventListener("complete", i),
                        e.removeEventListener("error", n),
                        e.removeEventListener("abort", n);
                    },
                    i = () => {
                      t(), s();
                    },
                    n = () => {
                      a(
                        e.error || new DOMException("AbortError", "AbortError"),
                      ),
                        s();
                    };
                  e.addEventListener("complete", i),
                    e.addEventListener("error", n),
                    e.addEventListener("abort", n);
                });
                S.set(e, t);
              })(t),
            E(
              t,
              s ||
                (s = [
                  IDBDatabase,
                  IDBObjectStore,
                  IDBIndex,
                  IDBCursor,
                  IDBTransaction,
                ]),
            ))
          ? new Proxy(t, D)
          : t;
    return a !== e && (q.set(e, a), C.set(a, e)), a;
  }
  const k = (e) => C.get(e);
  function P(
    e,
    t,
    { blocked: a, upgrade: s, blocking: i, terminated: n } = {},
  ) {
    const r = indexedDB.open(e, t),
      o = N(r);
    return (
      s &&
        r.addEventListener("upgradeneeded", (e) => {
          s(N(r.result), e.oldVersion, e.newVersion, N(r.transaction), e);
        }),
      a &&
        r.addEventListener("blocked", (e) => a(e.oldVersion, e.newVersion, e)),
      o
        .then((e) => {
          n && e.addEventListener("close", () => n()),
            i &&
              e.addEventListener("versionchange", (e) =>
                i(e.oldVersion, e.newVersion, e),
              );
        })
        .catch(() => {}),
      o
    );
  }
  const T = ["get", "getKey", "getAll", "getAllKeys", "count"],
    A = ["put", "add", "delete", "clear"],
    L = new Map();
  function I(e, t) {
    if (!(e instanceof IDBDatabase && !(t in e) && "string" == typeof t))
      return;
    if (L.get(t)) return L.get(t);
    const a = t.replace(/FromIndex$/, ""),
      s = t !== a,
      i = A.includes(a);
    if (
      !(a in (s ? IDBIndex : IDBObjectStore).prototype) ||
      !(i || T.includes(a))
    )
      return;
    const n = async function (e, ...t) {
      let n = this.transaction(e, i ? "readwrite" : "readonly"),
        r = n.store;
      return (
        s && (r = r.index(t.shift())),
        (await Promise.all([r[a](...t), i && n.done]))[0]
      );
    };
    return L.set(t, n), n;
  }
  D = {
    ...(e = D),
    get: (t, a, s) => I(t, a) || e.get(t, a, s),
    has: (t, a) => !!I(t, a) || e.has(t, a),
  };
  const U = ["continue", "continuePrimaryKey", "advance"],
    F = {},
    W = new WeakMap(),
    M = new WeakMap(),
    B = {
      get(e, t) {
        if (!U.includes(t)) return e[t];
        let a = F[t];
        return (
          a ||
            (a = F[t] =
              function (...e) {
                W.set(this, M.get(this)[t](...e));
              }),
          a
        );
      },
    };
  async function* O(...e) {
    let t = this;
    if ((t instanceof IDBCursor || (t = await t.openCursor(...e)), !t)) return;
    const a = new Proxy(t, B);
    for (M.set(a, t), C.set(a, k(t)); t; )
      yield a, (t = await (W.get(a) || t.continue())), W.delete(a);
  }
  function K(e, t) {
    return (
      (t === Symbol.asyncIterator &&
        E(e, [IDBIndex, IDBObjectStore, IDBCursor])) ||
      ("iterate" === t && E(e, [IDBIndex, IDBObjectStore]))
    );
  }
  D = {
    ...(t = D),
    get: (e, a, s) => (K(e, a) ? O : t.get(e, a, s)),
    has: (e, a) => K(e, a) || t.has(e, a),
  };
  const j = "requests",
    $ = "queueName";
  class H {
    _db = null;
    async addEntry(e) {
      const t = (await this.getDb()).transaction(j, "readwrite", {
        durability: "relaxed",
      });
      await t.store.add(e), await t.done;
    }
    async getFirstEntryId() {
      const e = await this.getDb(),
        t = await e.transaction(j).store.openCursor();
      return t?.value.id;
    }
    async getAllEntriesByQueueName(e) {
      const t = await this.getDb();
      return (await t.getAllFromIndex(j, $, IDBKeyRange.only(e))) || [];
    }
    async getEntryCountByQueueName(e) {
      return (await this.getDb()).countFromIndex(j, $, IDBKeyRange.only(e));
    }
    async deleteEntry(e) {
      const t = await this.getDb();
      await t.delete(j, e);
    }
    async getFirstEntryByQueueName(e) {
      return await this.getEndEntryFromIndex(IDBKeyRange.only(e), "next");
    }
    async getLastEntryByQueueName(e) {
      return await this.getEndEntryFromIndex(IDBKeyRange.only(e), "prev");
    }
    async getEndEntryFromIndex(e, t) {
      const a = await this.getDb(),
        s = await a.transaction(j).store.index($).openCursor(e, t);
      return s?.value;
    }
    async getDb() {
      return (
        this._db ||
          (this._db = await P("serwist-background-sync", 3, {
            upgrade: this._upgradeDb,
          })),
        this._db
      );
    }
    _upgradeDb(e, t) {
      t > 0 &&
        t < 3 &&
        e.objectStoreNames.contains(j) &&
        e.deleteObjectStore(j),
        e
          .createObjectStore(j, { autoIncrement: !0, keyPath: "id" })
          .createIndex($, $, { unique: !1 });
    }
  }
  class G {
    _queueName;
    _queueDb;
    constructor(e) {
      (this._queueName = e), (this._queueDb = new H());
    }
    async pushEntry(e) {
      delete e.id,
        (e.queueName = this._queueName),
        await this._queueDb.addEntry(e);
    }
    async unshiftEntry(e) {
      const t = await this._queueDb.getFirstEntryId();
      t ? (e.id = t - 1) : delete e.id,
        (e.queueName = this._queueName),
        await this._queueDb.addEntry(e);
    }
    async popEntry() {
      return this._removeEntry(
        await this._queueDb.getLastEntryByQueueName(this._queueName),
      );
    }
    async shiftEntry() {
      return this._removeEntry(
        await this._queueDb.getFirstEntryByQueueName(this._queueName),
      );
    }
    async getAll() {
      return await this._queueDb.getAllEntriesByQueueName(this._queueName);
    }
    async size() {
      return await this._queueDb.getEntryCountByQueueName(this._queueName);
    }
    async deleteEntry(e) {
      await this._queueDb.deleteEntry(e);
    }
    async _removeEntry(e) {
      return e && (await this.deleteEntry(e.id)), e;
    }
  }
  const V = [
    "method",
    "referrer",
    "referrerPolicy",
    "mode",
    "credentials",
    "cache",
    "redirect",
    "integrity",
    "keepalive",
  ];
  class Q {
    _requestData;
    static async fromRequest(e) {
      const t = { url: e.url, headers: {} };
      for (const a of ("GET" !== e.method &&
        (t.body = await e.clone().arrayBuffer()),
      e.headers.forEach((e, a) => {
        t.headers[a] = e;
      }),
      V))
        void 0 !== e[a] && (t[a] = e[a]);
      return new Q(t);
    }
    constructor(e) {
      "navigate" === e.mode && (e.mode = "same-origin"),
        (this._requestData = e);
    }
    toObject() {
      const e = Object.assign({}, this._requestData);
      return (
        (e.headers = Object.assign({}, this._requestData.headers)),
        e.body && (e.body = e.body.slice(0)),
        e
      );
    }
    toRequest() {
      return new Request(this._requestData.url, this._requestData);
    }
    clone() {
      return new Q(this.toObject());
    }
  }
  const z = "serwist-background-sync",
    J = new Set(),
    X = (e) => {
      const t = {
        request: new Q(e.requestData).toRequest(),
        timestamp: e.timestamp,
      };
      return e.metadata && (t.metadata = e.metadata), t;
    };
  class Y {
    _name;
    _onSync;
    _maxRetentionTime;
    _queueStore;
    _forceSyncFallback;
    _syncInProgress = !1;
    _requestsAddedDuringSync = !1;
    constructor(
      e,
      { forceSyncFallback: t, onSync: a, maxRetentionTime: s } = {},
    ) {
      if (J.has(e)) throw new d("duplicate-queue-name", { name: e });
      J.add(e),
        (this._name = e),
        (this._onSync = a || this.replayRequests),
        (this._maxRetentionTime = s || 10080),
        (this._forceSyncFallback = !!t),
        (this._queueStore = new G(this._name)),
        this._addSyncListener();
    }
    get name() {
      return this._name;
    }
    async pushRequest(e) {
      await this._addRequest(e, "push");
    }
    async unshiftRequest(e) {
      await this._addRequest(e, "unshift");
    }
    async popRequest() {
      return this._removeRequest("pop");
    }
    async shiftRequest() {
      return this._removeRequest("shift");
    }
    async getAll() {
      const e = await this._queueStore.getAll(),
        t = Date.now(),
        a = [];
      for (const s of e) {
        const e = 6e4 * this._maxRetentionTime;
        t - s.timestamp > e
          ? await this._queueStore.deleteEntry(s.id)
          : a.push(X(s));
      }
      return a;
    }
    async size() {
      return await this._queueStore.size();
    }
    async _addRequest(
      { request: e, metadata: t, timestamp: a = Date.now() },
      s,
    ) {
      const i = {
        requestData: (await Q.fromRequest(e.clone())).toObject(),
        timestamp: a,
      };
      switch ((t && (i.metadata = t), s)) {
        case "push":
          await this._queueStore.pushEntry(i);
          break;
        case "unshift":
          await this._queueStore.unshiftEntry(i);
      }
      this._syncInProgress
        ? (this._requestsAddedDuringSync = !0)
        : await this.registerSync();
    }
    async _removeRequest(e) {
      let t;
      const a = Date.now();
      switch (e) {
        case "pop":
          t = await this._queueStore.popEntry();
          break;
        case "shift":
          t = await this._queueStore.shiftEntry();
      }
      if (t) {
        const s = 6e4 * this._maxRetentionTime;
        return a - t.timestamp > s ? this._removeRequest(e) : X(t);
      }
    }
    async replayRequests() {
      let e;
      while ((e = await this.shiftRequest()))
        try {
          await fetch(e.request.clone());
        } catch (t) {
          throw (
            (await this.unshiftRequest(e),
            new d("queue-replay-failed", { name: this._name }))
          );
        }
    }
    async registerSync() {
      if ("sync" in self.registration && !this._forceSyncFallback)
        try {
          await self.registration.sync.register(`${z}:${this._name}`);
        } catch (e) {}
    }
    _addSyncListener() {
      "sync" in self.registration && !this._forceSyncFallback
        ? self.addEventListener("sync", (e) => {
            if (e.tag === `${z}:${this._name}`) {
              const t = async () => {
                let t;
                this._syncInProgress = !0;
                try {
                  await this._onSync({ queue: this });
                } catch (e) {
                  if (e instanceof Error) throw e;
                } finally {
                  this._requestsAddedDuringSync &&
                    !(t && !e.lastChance) &&
                    (await this.registerSync()),
                    (this._syncInProgress = !1),
                    (this._requestsAddedDuringSync = !1);
                }
              };
              e.waitUntil(t());
            }
          })
        : this._onSync({ queue: this });
    }
    static get _queueNames() {
      return J;
    }
  }
  class Z {
    _queue;
    constructor(e, t) {
      this._queue = new Y(e, t);
    }
    fetchDidFail = async ({ request: e }) => {
      await this._queue.pushRequest({ request: e });
    };
  }
  const ee = (e) => (e && "object" == typeof e ? e : { handle: e });
  class et {
    handler;
    match;
    method;
    catchHandler;
    constructor(e, t, a = "GET") {
      (this.handler = ee(t)), (this.match = e), (this.method = a);
    }
    setCatchHandler(e) {
      this.catchHandler = ee(e);
    }
  }
  class ea extends et {
    _allowlist;
    _denylist;
    constructor(e, { allowlist: t = [/./], denylist: a = [] } = {}) {
      super((e) => this._match(e), e),
        (this._allowlist = t),
        (this._denylist = a);
    }
    _match({ url: e, request: t }) {
      if (t && "navigate" !== t.mode) return !1;
      const a = e.pathname + e.search;
      for (const e of this._denylist) if (e.test(a)) return !1;
      return !!this._allowlist.some((e) => e.test(a));
    }
  }
  class es extends et {
    constructor(e, t, a) {
      super(
        ({ url: t }) => {
          const a = e.exec(t.href);
          if (a && (t.origin === location.origin || 0 === a.index))
            return a.slice(1);
        },
        t,
        a,
      );
    }
  }
  class ei {
    _routes;
    _defaultHandlerMap;
    _catchHandler;
    constructor() {
      (this._routes = new Map()), (this._defaultHandlerMap = new Map());
    }
    get routes() {
      return this._routes;
    }
    addFetchListener() {
      self.addEventListener("fetch", (e) => {
        const { request: t } = e,
          a = this.handleRequest({ request: t, event: e });
        a && e.respondWith(a);
      });
    }
    addCacheListener() {
      self.addEventListener("message", (e) => {
        if (e.data && "CACHE_URLS" === e.data.type) {
          const { payload: t } = e.data,
            a = Promise.all(
              t.urlsToCache.map((t) => {
                "string" == typeof t && (t = [t]);
                const a = new Request(...t);
                return this.handleRequest({ request: a, event: e });
              }),
            );
          e.waitUntil(a),
            e.ports?.[0] && a.then(() => e.ports[0].postMessage(!0));
        }
      });
    }
    handleRequest({ request: e, event: t }) {
      let a;
      const s = new URL(e.url, location.href);
      if (!s.protocol.startsWith("http")) return;
      let i = s.origin === location.origin,
        { params: n, route: r } = this.findMatchingRoute({
          event: t,
          request: e,
          sameOrigin: i,
          url: s,
        }),
        o = r?.handler,
        c = e.method;
      if (
        (!o &&
          this._defaultHandlerMap.has(c) &&
          (o = this._defaultHandlerMap.get(c)),
        !o)
      )
        return;
      try {
        a = o.handle({ url: s, request: e, event: t, params: n });
      } catch (e) {
        a = Promise.reject(e);
      }
      const l = r?.catchHandler;
      return (
        a instanceof Promise &&
          (this._catchHandler || l) &&
          (a = a.catch(async (a) => {
            if (l)
              try {
                return await l.handle({
                  url: s,
                  request: e,
                  event: t,
                  params: n,
                });
              } catch (e) {
                e instanceof Error && (a = e);
              }
            if (this._catchHandler)
              return this._catchHandler.handle({
                url: s,
                request: e,
                event: t,
              });
            throw a;
          })),
        a
      );
    }
    findMatchingRoute({ url: e, sameOrigin: t, request: a, event: s }) {
      for (const i of this._routes.get(a.method) || []) {
        let n;
        const r = i.match({ url: e, sameOrigin: t, request: a, event: s });
        if (r)
          return (
            Array.isArray((n = r)) && 0 === n.length
              ? (n = void 0)
              : r.constructor === Object && 0 === Object.keys(r).length
                ? (n = void 0)
                : "boolean" == typeof r && (n = void 0),
            { route: i, params: n }
          );
      }
      return {};
    }
    setDefaultHandler(e, t = "GET") {
      this._defaultHandlerMap.set(t, ee(e));
    }
    setCatchHandler(e) {
      this._catchHandler = ee(e);
    }
    registerRoute(e) {
      this._routes.has(e.method) || this._routes.set(e.method, []),
        this._routes.get(e.method).push(e);
    }
    unregisterRoute(e) {
      if (!this._routes.has(e.method))
        throw new d("unregister-route-but-not-found-with-method", {
          method: e.method,
        });
      const t = this._routes.get(e.method).indexOf(e);
      if (t > -1) this._routes.get(e.method).splice(t, 1);
      else throw new d("unregister-route-route-not-registered");
    }
  }
  const en = () => (
    n || ((n = new ei()).addFetchListener(), n.addCacheListener()), n
  );
  function er(e, t, a) {
    let s;
    if ("string" == typeof e) {
      const i = new URL(e, location.href);
      s = new et(({ url: e }) => e.href === i.href, t, a);
    } else if (e instanceof RegExp) s = new es(e, t, a);
    else if ("function" == typeof e) s = new et(e, t, a);
    else if (e instanceof et) s = e;
    else
      throw new d("unsupported-route-type", {
        moduleName: "@serwist/routing",
        funcName: "registerRoute",
        paramName: "capture",
      });
    return en().registerRoute(s), s;
  }
  function eo(e) {
    return "string" == typeof e ? new Request(e) : e;
  }
  class ec {
    request;
    url;
    event;
    params;
    _cacheKeys = {};
    _strategy;
    _extendLifetimePromises;
    _handlerDeferred;
    _plugins;
    _pluginStateMap;
    constructor(e, t) {
      for (const a of (Object.assign(this, t),
      (this.event = t.event),
      (this._strategy = e),
      (this._handlerDeferred = new m()),
      (this._extendLifetimePromises = []),
      (this._plugins = [...e.plugins]),
      (this._pluginStateMap = new Map()),
      this._plugins))
        this._pluginStateMap.set(a, {});
      this.event.waitUntil(this._handlerDeferred.promise);
    }
    async fetch(e) {
      let { event: t } = this,
        a = eo(e);
      if (
        "navigate" === a.mode &&
        t instanceof FetchEvent &&
        t.preloadResponse
      ) {
        const e = await t.preloadResponse;
        if (e) return e;
      }
      const s = this.hasCallback("fetchDidFail") ? a.clone() : null;
      try {
        for (const e of this.iterateCallbacks("requestWillFetch"))
          a = await e({ request: a.clone(), event: t });
      } catch (e) {
        if (e instanceof Error)
          throw new d("plugin-error-request-will-fetch", {
            thrownErrorMessage: e.message,
          });
      }
      const i = a.clone();
      try {
        let e;
        for (const s of ((e = await fetch(
          a,
          "navigate" === a.mode ? void 0 : this._strategy.fetchOptions,
        )),
        this.iterateCallbacks("fetchDidSucceed")))
          e = await s({ event: t, request: i, response: e });
        return e;
      } catch (e) {
        throw (
          (s &&
            (await this.runCallbacks("fetchDidFail", {
              error: e,
              event: t,
              originalRequest: s.clone(),
              request: i.clone(),
            })),
          e)
        );
      }
    }
    async fetchAndCachePut(e) {
      const t = await this.fetch(e),
        a = t.clone();
      return this.waitUntil(this.cachePut(e, a)), t;
    }
    async cacheMatch(e) {
      let t;
      const a = eo(e),
        { cacheName: s, matchOptions: i } = this._strategy,
        n = await this.getCacheKey(a, "read"),
        r = { ...i, cacheName: s };
      for (const e of ((t = await caches.match(n, r)),
      this.iterateCallbacks("cachedResponseWillBeUsed")))
        t =
          (await e({
            cacheName: s,
            matchOptions: i,
            cachedResponse: t,
            request: n,
            event: this.event,
          })) || void 0;
      return t;
    }
    async cachePut(e, t) {
      const a = eo(e);
      await v(0);
      const s = await this.getCacheKey(a, "write");
      if (!t) throw new d("cache-put-with-no-response", { url: b(s.url) });
      const i = await this._ensureResponseSafeToCache(t);
      if (!i) return !1;
      const { cacheName: n, matchOptions: r } = this._strategy,
        o = await self.caches.open(n),
        c = this.hasCallback("cacheDidUpdate"),
        l = c ? await w(o, s.clone(), ["__WB_REVISION__"], r) : null;
      try {
        await o.put(s, c ? i.clone() : i);
      } catch (e) {
        if (e instanceof Error)
          throw ("QuotaExceededError" === e.name && (await _()), e);
      }
      for (const e of this.iterateCallbacks("cacheDidUpdate"))
        await e({
          cacheName: n,
          oldResponse: l,
          newResponse: i.clone(),
          request: s,
          event: this.event,
        });
      return !0;
    }
    async getCacheKey(e, t) {
      const a = `${e.url} | ${t}`;
      if (!this._cacheKeys[a]) {
        let s = e;
        for (const e of this.iterateCallbacks("cacheKeyWillBeUsed"))
          s = eo(
            await e({
              mode: t,
              request: s,
              event: this.event,
              params: this.params,
            }),
          );
        this._cacheKeys[a] = s;
      }
      return this._cacheKeys[a];
    }
    hasCallback(e) {
      for (const t of this._strategy.plugins) if (e in t) return !0;
      return !1;
    }
    async runCallbacks(e, t) {
      for (const a of this.iterateCallbacks(e)) await a(t);
    }
    *iterateCallbacks(e) {
      for (const t of this._strategy.plugins)
        if ("function" == typeof t[e]) {
          const a = this._pluginStateMap.get(t),
            s = (s) => {
              const i = { ...s, state: a };
              return t[e](i);
            };
          yield s;
        }
    }
    waitUntil(e) {
      return this._extendLifetimePromises.push(e), e;
    }
    async doneWaiting() {
      let e;
      while ((e = this._extendLifetimePromises.shift())) await e;
    }
    destroy() {
      this._handlerDeferred.resolve(null);
    }
    async _ensureResponseSafeToCache(e) {
      let t = e,
        a = !1;
      for (const e of this.iterateCallbacks("cacheWillUpdate"))
        if (
          ((t =
            (await e({
              request: this.request,
              response: t,
              event: this.event,
            })) || void 0),
          (a = !0),
          !t)
        )
          break;
      return !a && t && 200 !== t.status && (t = void 0), t;
    }
  }
  class el {
    cacheName;
    plugins;
    fetchOptions;
    matchOptions;
    constructor(e = {}) {
      (this.cacheName = h.getRuntimeName(e.cacheName)),
        (this.plugins = e.plugins || []),
        (this.fetchOptions = e.fetchOptions),
        (this.matchOptions = e.matchOptions);
    }
    handle(e) {
      const [t] = this.handleAll(e);
      return t;
    }
    handleAll(e) {
      e instanceof FetchEvent && (e = { event: e, request: e.request });
      const t = e.event,
        a = "string" == typeof e.request ? new Request(e.request) : e.request,
        s = new ec(this, {
          event: t,
          request: a,
          params: "params" in e ? e.params : void 0,
        }),
        i = this._getResponse(s, a, t),
        n = this._awaitComplete(i, s, a, t);
      return [i, n];
    }
    async _getResponse(e, t, a) {
      let s;
      await e.runCallbacks("handlerWillStart", { event: a, request: t });
      try {
        if (
          ((s = await this._handle(t, e)), void 0 === s || "error" === s.type)
        )
          throw new d("no-response", { url: t.url });
      } catch (i) {
        if (i instanceof Error) {
          for (const n of e.iterateCallbacks("handlerDidError"))
            if (void 0 !== (s = await n({ error: i, event: a, request: t })))
              break;
        }
        if (!s) throw i;
      }
      for (const i of e.iterateCallbacks("handlerWillRespond"))
        s = await i({ event: a, request: t, response: s });
      return s;
    }
    async _awaitComplete(e, t, a, s) {
      let i, n;
      try {
        i = await e;
      } catch (e) {}
      try {
        await t.runCallbacks("handlerDidRespond", {
          event: s,
          request: a,
          response: i,
        }),
          await t.doneWaiting();
      } catch (e) {
        e instanceof Error && (n = e);
      }
      if (
        (await t.runCallbacks("handlerDidComplete", {
          event: s,
          request: a,
          response: i,
          error: n,
        }),
        t.destroy(),
        n)
      )
        throw n;
    }
  }
  class eh extends el {
    async _handle(e, t) {
      let a,
        s = await t.cacheMatch(e);
      if (!s)
        try {
          s = await t.fetchAndCachePut(e);
        } catch (e) {
          e instanceof Error && (a = e);
        }
      if (!s) throw new d("no-response", { url: e.url, error: a });
      return s;
    }
  }
  class eu extends el {
    async _handle(e, t) {
      const a = await t.cacheMatch(e);
      if (!a) throw new d("no-response", { url: e.url });
      return a;
    }
  }
  const ed = {
    cacheWillUpdate: async ({ response: e }) =>
      200 === e.status || 0 === e.status ? e : null,
  };
  class ef extends el {
    _networkTimeoutSeconds;
    constructor(e = {}) {
      super(e),
        this.plugins.some((e) => "cacheWillUpdate" in e) ||
          this.plugins.unshift(ed),
        (this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0);
    }
    async _handle(e, t) {
      let a;
      const s = [],
        i = [];
      if (this._networkTimeoutSeconds) {
        const { id: n, promise: r } = this._getTimeoutPromise({
          request: e,
          logs: s,
          handler: t,
        });
        (a = n), i.push(r);
      }
      const n = this._getNetworkPromise({
        timeoutId: a,
        request: e,
        logs: s,
        handler: t,
      });
      i.push(n);
      const r = await t.waitUntil(
        (async () => (await t.waitUntil(Promise.race(i))) || (await n))(),
      );
      if (!r) throw new d("no-response", { url: e.url });
      return r;
    }
    _getTimeoutPromise({ request: e, logs: t, handler: a }) {
      let s;
      return {
        promise: new Promise((t) => {
          s = setTimeout(async () => {
            t(await a.cacheMatch(e));
          }, 1e3 * this._networkTimeoutSeconds);
        }),
        id: s,
      };
    }
    async _getNetworkPromise({
      timeoutId: e,
      request: t,
      logs: a,
      handler: s,
    }) {
      let i, n;
      try {
        n = await s.fetchAndCachePut(t);
      } catch (e) {
        e instanceof Error && (i = e);
      }
      return e && clearTimeout(e), (i || !n) && (n = await s.cacheMatch(t)), n;
    }
  }
  class ep extends el {
    _networkTimeoutSeconds;
    constructor(e = {}) {
      super(e), (this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0);
    }
    async _handle(e, t) {
      let a, s;
      try {
        const s = [t.fetch(e)];
        if (this._networkTimeoutSeconds) {
          const e = v(1e3 * this._networkTimeoutSeconds);
          s.push(e);
        }
        if (!(a = await Promise.race(s)))
          throw Error(
            `Timed out the network response after ${this._networkTimeoutSeconds} seconds.`,
          );
      } catch (e) {
        e instanceof Error && (s = e);
      }
      if (!a) throw new d("no-response", { url: e.url, error: s });
      return a;
    }
  }
  class em extends el {
    constructor(e = {}) {
      super(e),
        this.plugins.some((e) => "cacheWillUpdate" in e) ||
          this.plugins.unshift(ed);
    }
    async _handle(e, t) {
      let a;
      const s = t.fetchAndCachePut(e).catch(() => {});
      t.waitUntil(s);
      let i = await t.cacheMatch(e);
      if (i);
      else
        try {
          i = await s;
        } catch (e) {
          e instanceof Error && (a = e);
        }
      if (!i) throw new d("no-response", { url: e.url, error: a });
      return i;
    }
  }
  const eg = "www.google-analytics.com",
    ew = "www.googletagmanager.com",
    ey = /^\/(\w+\/)?collect/,
    e_ =
      (e) =>
      async ({ queue: t }) => {
        let a;
        while ((a = await t.shiftRequest())) {
          const { request: s, timestamp: i } = a,
            n = new URL(s.url);
          try {
            const t =
                "POST" === s.method
                  ? new URLSearchParams(await s.clone().text())
                  : n.searchParams,
              a = i - (Number(t.get("qt")) || 0),
              r = Date.now() - a;
            if ((t.set("qt", String(r)), e.parameterOverrides))
              for (const a of Object.keys(e.parameterOverrides)) {
                const s = e.parameterOverrides[a];
                t.set(a, s);
              }
            "function" == typeof e.hitFilter && e.hitFilter.call(null, t),
              await fetch(
                new Request(n.origin + n.pathname, {
                  body: t.toString(),
                  method: "POST",
                  mode: "cors",
                  credentials: "omit",
                  headers: { "Content-Type": "text/plain" },
                }),
              );
          } catch (e) {
            throw (await t.unshiftRequest(a), e);
          }
        }
      },
    eb = (e) => {
      const t = ({ url: e }) => e.hostname === eg && ey.test(e.pathname),
        a = new ep({ plugins: [e] });
      return [new et(t, a, "GET"), new et(t, a, "POST")];
    },
    ev = (e) =>
      new et(
        ({ url: e }) => e.hostname === eg && "/analytics.js" === e.pathname,
        new ef({ cacheName: e }),
        "GET",
      ),
    ex = (e) =>
      new et(
        ({ url: e }) => e.hostname === ew && "/gtag/js" === e.pathname,
        new ef({ cacheName: e }),
        "GET",
      ),
    eR = (e) =>
      new et(
        ({ url: e }) => e.hostname === ew && "/gtm.js" === e.pathname,
        new ef({ cacheName: e }),
        "GET",
      ),
    eE = (e = {}) => {
      const t = h.getGoogleAnalyticsName(e.cacheName),
        a = new Z("serwist-google-analytics", {
          maxRetentionTime: 2880,
          onSync: e_(e),
        }),
        s = [eR(t), ev(t), ex(t), ...eb(a)],
        i = new ei();
      for (const e of s) i.registerRoute(e);
      i.addFetchListener();
    };
  class eS extends el {
    _fallbackToNetwork;
    static defaultPrecacheCacheabilityPlugin = {
      cacheWillUpdate: async ({ response: e }) =>
        !e || e.status >= 400 ? null : e,
    };
    static copyRedirectedCacheableResponsesPlugin = {
      cacheWillUpdate: async ({ response: e }) =>
        e.redirected ? await p(e) : e,
    };
    constructor(e = {}) {
      (e.cacheName = h.getPrecacheName(e.cacheName)),
        super(e),
        (this._fallbackToNetwork = !1 !== e.fallbackToNetwork),
        this.plugins.push(eS.copyRedirectedCacheableResponsesPlugin);
    }
    async _handle(e, t) {
      return (
        (await t.cacheMatch(e)) ||
        (t.event && "install" === t.event.type
          ? await this._handleInstall(e, t)
          : await this._handleFetch(e, t))
      );
    }
    async _handleFetch(e, t) {
      let a;
      const s = t.params || {};
      if (this._fallbackToNetwork) {
        const i = s.integrity,
          n = e.integrity,
          r = !n || n === i;
        (a = await t.fetch(
          new Request(e, { integrity: "no-cors" !== e.mode ? n || i : void 0 }),
        )),
          i &&
            r &&
            "no-cors" !== e.mode &&
            (this._useDefaultCacheabilityPluginIfNeeded(),
            await t.cachePut(e, a.clone()));
      } else
        throw new d("missing-precache-entry", {
          cacheName: this.cacheName,
          url: e.url,
        });
      return a;
    }
    async _handleInstall(e, t) {
      this._useDefaultCacheabilityPluginIfNeeded();
      const a = await t.fetch(e);
      if (!(await t.cachePut(e, a.clone())))
        throw new d("bad-precaching-response", {
          url: e.url,
          status: a.status,
        });
      return a;
    }
    _useDefaultCacheabilityPluginIfNeeded() {
      let e = null,
        t = 0;
      for (const [a, s] of this.plugins.entries())
        s !== eS.copyRedirectedCacheableResponsesPlugin &&
          (s === eS.defaultPrecacheCacheabilityPlugin && (e = a),
          s.cacheWillUpdate && t++);
      0 === t
        ? this.plugins.push(eS.defaultPrecacheCacheabilityPlugin)
        : t > 1 && null !== e && this.plugins.splice(e, 1);
    }
  }
  class eq {
    _precacheController;
    constructor({ precacheController: e }) {
      this._precacheController = e;
    }
    cacheKeyWillBeUsed = async ({ request: e, params: t }) => {
      const a =
        t?.cacheKey || this._precacheController.getCacheKeyForURL(e.url);
      return a ? new Request(a, { headers: e.headers }) : e;
    };
  }
  class eC {
    updatedURLs = [];
    notUpdatedURLs = [];
    handlerWillStart = async ({ request: e, state: t }) => {
      t && (t.originalRequest = e);
    };
    cachedResponseWillBeUsed = async ({
      event: e,
      state: t,
      cachedResponse: a,
    }) => {
      if (
        "install" === e.type &&
        t?.originalRequest &&
        t.originalRequest instanceof Request
      ) {
        const e = t.originalRequest.url;
        a ? this.notUpdatedURLs.push(e) : this.updatedURLs.push(e);
      }
      return a;
    };
  }
  class eD {
    _installAndActiveListenersAdded;
    _strategy;
    _urlsToCacheKeys = new Map();
    _urlsToCacheModes = new Map();
    _cacheKeysToIntegrities = new Map();
    constructor({
      cacheName: e,
      plugins: t = [],
      fallbackToNetwork: a = !0,
    } = {}) {
      (this._strategy = new eS({
        cacheName: h.getPrecacheName(e),
        plugins: [...t, new eq({ precacheController: this })],
        fallbackToNetwork: a,
      })),
        (this.install = this.install.bind(this)),
        (this.activate = this.activate.bind(this));
    }
    get strategy() {
      return this._strategy;
    }
    precache(e) {
      this.addToCacheList(e),
        this._installAndActiveListenersAdded ||
          (self.addEventListener("install", this.install),
          self.addEventListener("activate", this.activate),
          (this._installAndActiveListenersAdded = !0));
    }
    addToCacheList(e) {
      const t = [];
      for (const a of e) {
        "string" == typeof a
          ? t.push(a)
          : a && void 0 === a.revision && t.push(a.url);
        const { cacheKey: e, url: s } = ((e) => {
            if (!e)
              throw new d("add-to-cache-list-unexpected-type", { entry: e });
            if ("string" == typeof e) {
              const t = new URL(e, location.href);
              return { cacheKey: t.href, url: t.href };
            }
            const { revision: t, url: a } = e;
            if (!a)
              throw new d("add-to-cache-list-unexpected-type", { entry: e });
            if (!t) {
              const e = new URL(a, location.href);
              return { cacheKey: e.href, url: e.href };
            }
            const s = new URL(a, location.href),
              i = new URL(a, location.href);
            return (
              s.searchParams.set("__WB_REVISION__", t),
              { cacheKey: s.href, url: i.href }
            );
          })(a),
          i = "string" != typeof a && a.revision ? "reload" : "default";
        if (this._urlsToCacheKeys.has(s) && this._urlsToCacheKeys.get(s) !== e)
          throw new d("add-to-cache-list-conflicting-entries", {
            firstEntry: this._urlsToCacheKeys.get(s),
            secondEntry: e,
          });
        if ("string" != typeof a && a.integrity) {
          if (
            this._cacheKeysToIntegrities.has(e) &&
            this._cacheKeysToIntegrities.get(e) !== a.integrity
          )
            throw new d("add-to-cache-list-conflicting-integrities", {
              url: s,
            });
          this._cacheKeysToIntegrities.set(e, a.integrity);
        }
        this._urlsToCacheKeys.set(s, e),
          this._urlsToCacheModes.set(s, i),
          t.length > 0 &&
            console.warn(`Serwist is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`);
      }
    }
    install(e) {
      return R(e, async () => {
        const t = new eC();
        for (const [a, s] of (this.strategy.plugins.push(t),
        this._urlsToCacheKeys)) {
          const t = this._cacheKeysToIntegrities.get(s),
            i = this._urlsToCacheModes.get(a),
            n = new Request(a, {
              integrity: t,
              cache: i,
              credentials: "same-origin",
            });
          await Promise.all(
            this.strategy.handleAll({
              params: { cacheKey: s },
              request: n,
              event: e,
            }),
          );
        }
        const { updatedURLs: a, notUpdatedURLs: s } = t;
        return { updatedURLs: a, notUpdatedURLs: s };
      });
    }
    activate(e) {
      return R(e, async () => {
        const e = await self.caches.open(this.strategy.cacheName),
          t = await e.keys(),
          a = new Set(this._urlsToCacheKeys.values()),
          s = [];
        for (const i of t) a.has(i.url) || (await e.delete(i), s.push(i.url));
        return { deletedURLs: s };
      });
    }
    getURLsToCacheKeys() {
      return this._urlsToCacheKeys;
    }
    getCachedURLs() {
      return [...this._urlsToCacheKeys.keys()];
    }
    getCacheKeyForURL(e) {
      const t = new URL(e, location.href);
      return this._urlsToCacheKeys.get(t.href);
    }
    getIntegrityForCacheKey(e) {
      return this._cacheKeysToIntegrities.get(e);
    }
    async matchPrecache(e) {
      const t = e instanceof Request ? e.url : e,
        a = this.getCacheKeyForURL(t);
      if (a) return (await self.caches.open(this.strategy.cacheName)).match(a);
    }
    createHandlerBoundToURL(e) {
      const t = this.getCacheKeyForURL(e);
      if (!t) throw new d("non-precached-url", { url: e });
      return (a) => (
        (a.request = new Request(e)),
        (a.params = { cacheKey: t, ...a.params }),
        this.strategy.handle(a)
      );
    }
  }
  const eN = () => (r || (r = new eD()), r);
  class ek {
    _fallbackURL;
    _precacheController;
    constructor({ fallbackURL: e, precacheController: t }) {
      (this._fallbackURL = e), (this._precacheController = t || eN());
    }
    handlerDidError = () =>
      this._precacheController.matchPrecache(this._fallbackURL);
  }
  class eP extends et {
    constructor(e, t) {
      super(({ request: a }) => {
        const s = e.getURLsToCacheKeys();
        for (const i of (function* (
          e,
          {
            ignoreURLParametersMatching: t = [/^utm_/, /^fbclid$/],
            directoryIndex: a = "index.html",
            cleanURLs: s = !0,
            urlManipulation: i,
          } = {},
        ) {
          const n = new URL(e, location.href);
          (n.hash = ""), yield n.href;
          const r = ((e, t = []) => {
            for (const a of [...e.searchParams.keys()])
              t.some((e) => e.test(a)) && e.searchParams.delete(a);
            return e;
          })(n, t);
          if ((yield r.href, a && r.pathname.endsWith("/"))) {
            const e = new URL(r.href);
            (e.pathname += a), yield e.href;
          }
          if (s) {
            const e = new URL(r.href);
            (e.pathname += ".html"), yield e.href;
          }
          if (i) for (const e of i({ url: n })) yield e.href;
        })(a.url, t)) {
          const t = s.get(i);
          if (t) {
            const a = e.getIntegrityForCacheKey(t);
            return { cacheKey: t, integrity: a };
          }
        }
      }, e.strategy);
    }
  }
  const eT = "-precache-",
    eA = async (e, t = eT) => {
      const a = (await self.caches.keys()).filter(
        (a) => a.includes(t) && a.includes(self.registration.scope) && a !== e,
      );
      return await Promise.all(a.map((e) => self.caches.delete(e))), a;
    };
  function eL(e, t) {
    eN().precache(e), er(new eP(eN(), t));
  }
  const eI = (e, t, a) =>
      !a.some((a) => e.headers.has(a) && t.headers.has(a)) ||
      a.every((a) => {
        const s = e.headers.has(a) === t.headers.has(a),
          i = e.headers.get(a) === t.headers.get(a);
        return s && i;
      }),
    eU = ["content-length", "etag", "last-modified"],
    eF =
      "undefined" != typeof navigator &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  function eW(e) {
    return { cacheName: e.cacheName, updatedURL: e.request.url };
  }
  class eM {
    _headersToCheck;
    _generatePayload;
    _notifyAllClients;
    constructor({
      generatePayload: e,
      headersToCheck: t,
      notifyAllClients: a,
    } = {}) {
      (this._headersToCheck = t || eU),
        (this._generatePayload = e || eW),
        (this._notifyAllClients = a ?? !0);
    }
    async notifyIfUpdated(e) {
      if (
        e.oldResponse &&
        !eI(e.oldResponse, e.newResponse, this._headersToCheck)
      ) {
        const t = {
          type: "CACHE_UPDATED",
          meta: "serwist-broadcast-update",
          payload: this._generatePayload(e),
        };
        if ("navigate" === e.request.mode) {
          let t;
          e.event instanceof FetchEvent && (t = e.event.resultingClientId),
            (!(await x(t)) || eF) && (await v(3500));
        }
        if (this._notifyAllClients)
          for (const e of await self.clients.matchAll({ type: "window" }))
            e.postMessage(t);
        else if (e.event instanceof FetchEvent) {
          const a = await self.clients.get(e.event.clientId);
          a?.postMessage(t);
        }
      }
    }
  }
  class eB {
    _broadcastUpdate;
    constructor(e) {
      this._broadcastUpdate = new eM(e);
    }
    cacheDidUpdate = async (e) => {
      y(this._broadcastUpdate.notifyIfUpdated(e));
    };
  }
  class eO {
    _statuses;
    _headers;
    constructor(e = {}) {
      (this._statuses = e.statuses), (this._headers = e.headers);
    }
    isResponseCacheable(e) {
      let t = !0;
      return (
        this._statuses && (t = this._statuses.includes(e.status)),
        this._headers &&
          t &&
          (t = Object.keys(this._headers).some(
            (t) => e.headers.get(t) === this._headers[t],
          )),
        t
      );
    }
  }
  class eK {
    _cacheableResponse;
    constructor(e) {
      this._cacheableResponse = new eO(e);
    }
    cacheWillUpdate = async ({ response: e }) =>
      this._cacheableResponse.isResponseCacheable(e) ? e : null;
  }
  const ej = "cache-entries",
    e$ = (e) => {
      const t = new URL(e, location.href);
      return (t.hash = ""), t.href;
    };
  class eH {
    _cacheName;
    _db = null;
    constructor(e) {
      this._cacheName = e;
    }
    _upgradeDb(e) {
      const t = e.createObjectStore(ej, { keyPath: "id" });
      t.createIndex("cacheName", "cacheName", { unique: !1 }),
        t.createIndex("timestamp", "timestamp", { unique: !1 });
    }
    _upgradeDbAndDeleteOldDbs(e) {
      this._upgradeDb(e),
        this._cacheName &&
          ((e, { blocked: t } = {}) => {
            const a = indexedDB.deleteDatabase(e);
            t && a.addEventListener("blocked", (e) => t(e.oldVersion, e)),
              N(a).then(() => void 0);
          })(this._cacheName);
    }
    async setTimestamp(e, t) {
      const a = {
          url: (e = e$(e)),
          timestamp: t,
          cacheName: this._cacheName,
          id: this._getId(e),
        },
        s = (await this.getDb()).transaction(ej, "readwrite", {
          durability: "relaxed",
        });
      await s.store.put(a), await s.done;
    }
    async getTimestamp(e) {
      const t = await this.getDb(),
        a = await t.get(ej, this._getId(e));
      return a?.timestamp;
    }
    async expireEntries(e, t) {
      let a = await this.getDb(),
        s = await a
          .transaction(ej)
          .store.index("timestamp")
          .openCursor(null, "prev"),
        i = [],
        n = 0;
      while (s) {
        const a = s.value;
        a.cacheName === this._cacheName &&
          ((e && a.timestamp < e) || (t && n >= t) ? i.push(s.value) : n++),
          (s = await s.continue());
      }
      const r = [];
      for (const e of i) await a.delete(ej, e.id), r.push(e.url);
      return r;
    }
    _getId(e) {
      return `${this._cacheName}|${e$(e)}`;
    }
    async getDb() {
      return (
        this._db ||
          (this._db = await P("serwist-expiration", 1, {
            upgrade: this._upgradeDbAndDeleteOldDbs.bind(this),
          })),
        this._db
      );
    }
  }
  class eG {
    _isRunning = !1;
    _rerunRequested = !1;
    _maxEntries;
    _maxAgeSeconds;
    _matchOptions;
    _cacheName;
    _timestampModel;
    constructor(e, t = {}) {
      (this._maxEntries = t.maxEntries),
        (this._maxAgeSeconds = t.maxAgeSeconds),
        (this._matchOptions = t.matchOptions),
        (this._cacheName = e),
        (this._timestampModel = new eH(e));
    }
    async expireEntries() {
      if (this._isRunning) {
        this._rerunRequested = !0;
        return;
      }
      this._isRunning = !0;
      const e = this._maxAgeSeconds
          ? Date.now() - 1e3 * this._maxAgeSeconds
          : 0,
        t = await this._timestampModel.expireEntries(e, this._maxEntries),
        a = await self.caches.open(this._cacheName);
      for (const e of t) await a.delete(e, this._matchOptions);
      (this._isRunning = !1),
        this._rerunRequested &&
          ((this._rerunRequested = !1), y(this.expireEntries()));
    }
    async updateTimestamp(e) {
      await this._timestampModel.setTimestamp(e, Date.now());
    }
    async isURLExpired(e) {
      if (!this._maxAgeSeconds) return !1;
      const t = await this._timestampModel.getTimestamp(e),
        a = Date.now() - 1e3 * this._maxAgeSeconds;
      return void 0 === t || t < a;
    }
    async delete() {
      (this._rerunRequested = !1),
        await this._timestampModel.expireEntries(1 / 0);
    }
  }
  class eV {
    _config;
    _maxAgeSeconds;
    _cacheExpirations;
    constructor(e = {}) {
      (this._config = e),
        (this._maxAgeSeconds = e.maxAgeSeconds),
        (this._cacheExpirations = new Map()),
        e.purgeOnQuotaError && f.add(() => this.deleteCacheAndMetadata());
    }
    _getCacheExpiration(e) {
      if (e === h.getRuntimeName()) throw new d("expire-custom-caches-only");
      let t = this._cacheExpirations.get(e);
      return (
        t || ((t = new eG(e, this._config)), this._cacheExpirations.set(e, t)),
        t
      );
    }
    cachedResponseWillBeUsed = async ({
      event: e,
      request: t,
      cacheName: a,
      cachedResponse: s,
    }) => {
      if (!s) return null;
      const i = this._isResponseDateFresh(s),
        n = this._getCacheExpiration(a);
      y(n.expireEntries());
      const r = n.updateTimestamp(t.url);
      if (e)
        try {
          e.waitUntil(r);
        } catch (e) {}
      return i ? s : null;
    };
    _isResponseDateFresh(e) {
      if (!this._maxAgeSeconds) return !0;
      const t = this._getDateHeaderTimestamp(e);
      return null === t || t >= Date.now() - 1e3 * this._maxAgeSeconds;
    }
    _getDateHeaderTimestamp(e) {
      if (!e.headers.has("date")) return null;
      const t = new Date(e.headers.get("date")).getTime();
      return Number.isNaN(t) ? null : t;
    }
    cacheDidUpdate = async ({ cacheName: e, request: t }) => {
      const a = this._getCacheExpiration(e);
      await a.updateTimestamp(t.url), await a.expireEntries();
    };
    async deleteCacheAndMetadata() {
      for (const [e, t] of this._cacheExpirations)
        await self.caches.delete(e), await t.delete();
      this._cacheExpirations = new Map();
    }
  }
  async function eQ(e, t) {
    try {
      if (206 === t.status) return t;
      const a = e.headers.get("range");
      if (!a) throw new d("no-range-header");
      const s = ((e) => {
          const t = e.trim().toLowerCase();
          if (!t.startsWith("bytes="))
            throw new d("unit-must-be-bytes", { normalizedRangeHeader: t });
          if (t.includes(","))
            throw new d("single-range-only", { normalizedRangeHeader: t });
          const a = /(\d*)-(\d*)/.exec(t);
          if (!a || !(a[1] || a[2]))
            throw new d("invalid-range-values", { normalizedRangeHeader: t });
          return {
            start: "" === a[1] ? void 0 : Number(a[1]),
            end: "" === a[2] ? void 0 : Number(a[2]),
          };
        })(a),
        i = await t.blob(),
        n = ((e, t, a) => {
          let s, i;
          const n = e.size;
          if ((a && a > n) || (t && t < 0))
            throw new d("range-not-satisfiable", { size: n, end: a, start: t });
          return (
            void 0 !== t && void 0 !== a
              ? ((s = t), (i = a + 1))
              : void 0 !== t && void 0 === a
                ? ((s = t), (i = n))
                : void 0 !== a && void 0 === t && ((s = n - a), (i = n)),
            { start: s, end: i }
          );
        })(i, s.start, s.end),
        r = i.slice(n.start, n.end),
        o = r.size,
        c = new Response(r, {
          status: 206,
          statusText: "Partial Content",
          headers: t.headers,
        });
      return (
        c.headers.set("Content-Length", String(o)),
        c.headers.set(
          "Content-Range",
          `bytes ${n.start}-${n.end - 1}/${i.size}`,
        ),
        c
      );
    } catch (e) {
      return new Response("", {
        status: 416,
        statusText: "Range Not Satisfiable",
      });
    }
  }
  class ez {
    cachedResponseWillBeUsed = async ({ request: e, cachedResponse: t }) =>
      t && e.headers.has("range") ? await eQ(e, t) : t;
  }
  const eJ = () => {
      self.__WB_DISABLE_DEV_LOGS = !0;
    },
    eX = ({ runtimeCaching: e, entries: t, precacheOptions: a }) => (
      eL(
        t.map(({ url: e, revision: t }) => ({
          url: "string" == typeof e ? e : e.toString(),
          revision: t,
        })),
        a,
      ),
      (e = e.map(
        (e) => (
          !e.options ||
            e.options.precacheFallback ||
            e.options.plugins?.some((e) => "handlerDidError" in e) ||
            (e.options.plugins || (e.options.plugins = []),
            e.options.plugins.push({
              async handlerDidError(e) {
                for (const {
                  matcher: a,
                  url: s,
                  cacheMatchOptions: i = { ignoreSearch: !0 },
                } of t)
                  if (a(e)) return caches.match(s, i);
                return Response.error();
              },
            })),
          e
        ),
      ))
    ),
    eY = ({
      precacheEntries: e,
      precacheOptions: t,
      cleanupOutdatedCaches: a = !1,
      ...s
    }) => {
      if (
        (e && e.length > 0 && eL(e, t),
        a &&
          self.addEventListener("activate", (e) => {
            const t = h.getPrecacheName();
            e.waitUntil(eA(t).then((e) => {}));
          }),
        s.navigateFallback)
      ) {
        var i;
        er(
          new ea(((i = s.navigateFallback), eN().createHandlerBoundToURL(i)), {
            allowlist: s.navigateFallbackAllowlist,
            denylist: s.navigateFallbackDenylist,
          }),
        );
      }
    },
    eZ = (e) => null != e,
    e0 = {
      CacheFirst: eh,
      CacheOnly: eu,
      NetworkFirst: ef,
      NetworkOnly: ep,
      StaleWhileRevalidate: em,
    },
    e1 = (...e) => {
      for (const t of e)
        if ("string" == typeof t.handler) {
          const {
              cacheName: e,
              networkTimeoutSeconds: a,
              fetchOptions: s,
              matchOptions: i,
              plugins: n,
              backgroundSync: r,
              broadcastUpdate: o,
              cacheableResponse: c,
              expiration: l,
              precacheFallback: h,
              rangeRequests: u,
            } = t.options,
            d = e0[t.handler];
          er(
            t.urlPattern,
            new d({
              cacheName: e ?? void 0,
              networkTimeoutSeconds: a,
              fetchOptions: s,
              matchOptions: i,
              plugins: [
                ...(n ?? []),
                r && new Z(r.name, r.options),
                o && new eB({ channelName: o.channelName, ...o.options }),
                c && new eK(c),
                l && new eV(l),
                h && new ek(h),
                u ? new ez() : void 0,
              ].filter(eZ),
            }),
            t.method,
          );
        } else er(t.urlPattern, t.handler, t.method);
    };
  (({
    precacheEntries: e,
    precacheOptions: t,
    cleanupOutdatedCaches: a,
    skipWaiting: s = !1,
    importScripts: i,
    navigationPreload: n = !1,
    cacheId: r,
    clientsClaim: o = !1,
    runtimeCaching: c,
    offlineAnalyticsConfig: l,
    disableDevLogs: u,
    fallbacks: d,
    ...f
  }) => {
    var p;
    i && i.length > 0 && self.importScripts(...i),
      n &&
        self.registration?.navigationPreload &&
        self.addEventListener("activate", (e) => {
          e.waitUntil(
            self.registration.navigationPreload.enable().then(() => {
              p && self.registration.navigationPreload.setHeaderValue(p);
            }),
          );
        }),
      void 0 !== r && h.updateDetails({ prefix: r }),
      s
        ? self.skipWaiting()
        : self.addEventListener("message", (e) => {
            e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
          }),
      o && self.addEventListener("activate", () => self.clients.claim()),
      eY({
        precacheEntries: e,
        precacheOptions: t,
        cleanupOutdatedCaches: a,
        ...(f.navigateFallback && {
          navigateFallback: f.navigateFallback,
          navigateFallbackAllowlist: f.navigateFallbackAllowlist,
          navigateFallbackDenylist: f.navigateFallbackDenylist,
        }),
      }),
      void 0 !== c &&
        (void 0 !== d && (c = eX({ ...d, runtimeCaching: c })), e1(...c)),
      void 0 !== l && ("boolean" == typeof l ? l && eE() : eE(l)),
      u && eJ();
  })({
    precacheEntries: [
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/1917-90862fd9751fc590.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/2154-93a4bf1fbe14a2ed.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/2232-e7bc0e8aededd2e6.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/2451-43672f3461fd16ef.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/253-00d03e8cab84a5c0.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/2590-8bff778698af3131.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/2705-274f4412d95b9aac.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/3009-6d9a8b4c16e65a23.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/3360-f1030928e110c85d.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/3648-68ada078981e390a.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/37144445-bf0849386f4f22dc.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/3747-00a5dd30dcd18ed1.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/3aad4bda-44d63f106f1476a3.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/3c746cde-e1b7e6be8e337e50.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/4488-c8179e39bdc80d63.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/4913-34cf1c96c92cde86.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/4c531f84-3288dc59ee020053.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/6377-bed342da279ee8a2.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/6469-4b5bceeeac7adc58.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/6535-7dd6860dd2d3121b.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/65defed1-a25ac1b2c6aadc78.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/7720-3d5e2871b9ccbf92.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/7804-531ca9ae7d3b30cf.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/781f17b4-7df6f6279bcc62fc.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/7b733d5d-f2b9e068bcf290e1.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/8100ded3-9233297a45142cb7.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/8159-c0a86107d7102492.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/844-0dfe2a91afefbf2e.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/885-c0c03832d2c61a41.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/9844-2dbf3f2a3cc72ec5.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/accounts/page-99fd7505c648dd6c.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/auth/email-verification/%5Bemail%5D/page-439ab3b27a15d127.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/auth/help/page-f31388a2da386633.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/auth/login/page-e7dea00770bfe8b7.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/auth/reset-password/%5Bemail%5D/page-4a073d77b65f0ec4.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/auth/signup/page-cd13214ef0370603.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/budgets/page-d904e1c8d927e6ea.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/goals/page-6ad2c66c1f5b1aaa.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/layout-0c9985a33caf2d71.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/not-found-11d588fbbf9140e5.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/page-fdb96e5940011ac2.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/reports/page-e8b0c31ade5bce7a.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/settings/page-f9a0af172ff0372b.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/app/transactions/page-5d2a58beeb97ca7e.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/f5a862d5-91ffc05d29dea6ce.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/f923c8e2-c0548da67d373e1a.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/framework-c86f4b55c4d53453.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/main-360d6eed5cca694a.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/main-app-df6ef86cc0c9c6be.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/pages/_app-6d8eb21148ee1f50.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/pages/_error-ccbb050e2b4e78de.js",
      },
      {
        revision: "837c0df77fd5009c9e46d446188ecfd0",
        url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
      },
      {
        revision: "gKGgOvo5MB_8YWJLJjK79",
        url: "/_next/static/chunks/webpack-b6944671ed397da2.js",
      },
      {
        revision: "2f1a4ccefd392447",
        url: "/_next/static/css/2f1a4ccefd392447.css",
      },
      {
        revision: "090a5a15966b2cd72bd913c6ed85af43",
        url: "/_next/static/gKGgOvo5MB_8YWJLJjK79/_buildManifest.js",
      },
      {
        revision: "b6652df95db52feb4daf4eca35380933",
        url: "/_next/static/gKGgOvo5MB_8YWJLJjK79/_ssgManifest.js",
      },
      {
        revision: "f1b44860c66554b91f3b1c81556f73ca",
        url: "/_next/static/media/05a31a2ca4975f99-s.woff2",
      },
      {
        revision: "c4eb7f37bc4206c901ab08601f21f0f2",
        url: "/_next/static/media/513657b02c5c193f-s.woff2",
      },
      {
        revision: "bb9d99fb9bbc695be80777ca2c1c2bee",
        url: "/_next/static/media/51ed15f9841b9f9d-s.woff2",
      },
      {
        revision: "ad7fc44d000f7341e4cd953e9645c662",
        url: "/_next/static/media/Logo.400e1b96.svg",
      },
      {
        revision: "74c3556b9dad12fb76f84af53ba69410",
        url: "/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2",
      },
      {
        revision: "dd930bafc6297347be3213f22cc53d3e",
        url: "/_next/static/media/d6b16ce4a6175f26-s.woff2",
      },
      {
        revision: "0e89df9522084290e01e4127495fae99",
        url: "/_next/static/media/ec159349637c90ad-s.woff2",
      },
      {
        revision: "71f3fcaf22131c3368d9ec28ef839831",
        url: "/_next/static/media/fd4db3eb5472fc27-s.woff2",
      },
      {
        revision: "8683b3632794ccf709c83375941d7de3",
        url: "/android-chrome-192x192.png",
      },
      {
        revision: "abc3dec47a946a076626b3227f38da58",
        url: "/android-chrome-512x512.png",
      },
      {
        revision: "c0bd47e14e083979f25db0db6ce02717",
        url: "/apple-touch-icon.png",
      },
      {
        revision: "389eabe3c9a90736f426109c84458455",
        url: "/browserconfig.xml",
      },
      {
        revision: "aea59880292e03fe3a4f3b803ce7c354",
        url: "/favicon-16x16.png",
      },
      {
        revision: "f8ae824791ac20db3fb33d09d849091d",
        url: "/favicon-32x32.png",
      },
      {
        revision: "e8897441a5b053c62fdd85270bec474f",
        url: "/icon-192x192.png",
      },
      {
        revision: "931f90643cf2cd52002f68e72625fcc8",
        url: "/icon-256x256.png",
      },
      {
        revision: "3b7a3f864d62d5376990df4e74170ee8",
        url: "/icon-384x384.png",
      },
      {
        revision: "7095bfb42fa67eef0a55b712bc95e497",
        url: "/icon-512x512.png",
      },
      { revision: "83532b1a0e305133cb6463e5affaa143", url: "/manifest.json" },
      {
        revision: "12ff3aa1f7aa90741b8666a4b02e44e3",
        url: "/mstile-144x144.png",
      },
      {
        revision: "c234449cd11f93c10bb3cdca29ce5a55",
        url: "/mstile-150x150.png",
      },
      {
        revision: "7d9e7d21915352121eb40cb14c198b97",
        url: "/mstile-310x150.png",
      },
      {
        revision: "a95989e6a6edefe46ef4d463e554cfc5",
        url: "/mstile-310x310.png",
      },
      {
        revision: "9de9ccaac4a2c3ece8a173908f92175f",
        url: "/mstile-70x70.png",
      },
      { revision: "8e061864f388b47f33a1c3780831193e", url: "/next.svg" },
      {
        revision: "f4a99a2da98be595ad3fdaa072efb3ca",
        url: "/safari-pinned-tab.svg",
      },
      {
        revision: "cde67cbbdcc1baa6d9b3ef93662fd3b3",
        url: "/site.webmanifest",
      },
      {
        revision: "ad7b88e41783fa6fe0af4fdbcb0a1bc1",
        url: "/static/cashstash-logo.png",
      },
      { revision: "71782f0a19e1ac2b7126fa129afe790b", url: "/sw.js" },
      { revision: "61c6b19abff40ea7acd577be818f3976", url: "/vercel.svg" },
    ],
    skipWaiting: !0,
    clientsClaim: !0,
    navigationPreload: !0,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-webfonts",
          expiration: { maxEntries: 4, maxAgeSeconds: 31536e3 },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "google-fonts-stylesheets",
          expiration: { maxEntries: 4, maxAgeSeconds: 604800 },
        },
      },
      {
        urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-font-assets",
          expiration: { maxEntries: 4, maxAgeSeconds: 604800 },
        },
      },
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-image-assets",
          expiration: { maxEntries: 64, maxAgeSeconds: 2592e3 },
        },
      },
      {
        urlPattern: /\/_next\/static.+\.js$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static-js-assets",
          expiration: { maxEntries: 64, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\/_next\/image\?url=.+$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "next-image",
          expiration: { maxEntries: 64, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\.(?:mp3|wav|ogg)$/i,
        handler: "CacheFirst",
        options: {
          rangeRequests: !0,
          cacheName: "static-audio-assets",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\.(?:mp4|webm)$/i,
        handler: "CacheFirst",
        options: {
          rangeRequests: !0,
          cacheName: "static-video-assets",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\.(?:js)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-js-assets",
          expiration: { maxEntries: 48, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\.(?:css|less)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-style-assets",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "next-data",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: /\.(?:json|xml|csv)$/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "static-data-assets",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: ({ sameOrigin: e, url: { pathname: t } }) =>
          !(!e || t.startsWith("/api/auth/callback")) &&
          !!t.startsWith("/api/"),
        handler: "NetworkFirst",
        method: "GET",
        options: {
          cacheName: "apis",
          expiration: { maxEntries: 16, maxAgeSeconds: 86400 },
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: ({ request: e, url: { pathname: t }, sameOrigin: a }) =>
          "1" === e.headers.get("RSC") &&
          "1" === e.headers.get("Next-Router-Prefetch") &&
          a &&
          !t.startsWith("/api/"),
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-rsc-prefetch",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: ({ request: e, url: { pathname: t }, sameOrigin: a }) =>
          "1" === e.headers.get("RSC") && a && !t.startsWith("/api/"),
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-rsc",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: ({ url: { pathname: e }, sameOrigin: t }) =>
          t && !e.startsWith("/api/"),
        handler: "NetworkFirst",
        options: {
          cacheName: "pages",
          expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
        },
      },
      {
        urlPattern: ({ sameOrigin: e }) => !e,
        handler: "NetworkFirst",
        options: {
          cacheName: "cross-origin",
          expiration: { maxEntries: 32, maxAgeSeconds: 3600 },
          networkTimeoutSeconds: 10,
        },
      },
    ],
  });
})();
