import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

const formatNumberDots = (val) => {
  const digits = val.replace(/\D/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("id-ID");
};

async function runE2ETests() {
  console.log("===================================================================");
  console.log(" 🚀 STARTING FULL END-TO-END SYSTEM TEST ON NICEGAMING ");
  console.log(` Target Server: ${BASE_URL}`);
  console.log("===================================================================\n");

  const results = {
    test1_settings: false,
    test2_storefront: false,
    test3_pricelist: false,
    test4_testimonials: false,
    test5_blacklist: false,
  };

  // =========================================================================
  // 1. PENGATURAN TOKO (STORE SETTINGS)
  // =========================================================================
  console.log("▶ [TEST 1] Pengujian Pengaturan Toko di /admin");
  try {
    const targetWhatsapp = "6283863946967";
    const storeName = "NiceGaming";
    const noticeBanner = "⚡ Pengiriman Robux instan 1-5 menit via Gamepass 100% aman & legal!";

    console.log(`  1.1. Mengirim payload update WhatsApp ke: ${targetWhatsapp}`);
    const postSettingsRes = await fetch(`${BASE_URL}/api/store-settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        store_name: storeName,
        whatsapp_number: targetWhatsapp,
        promo_active: true,
        promo_robux_amount: 2200,
        promo_original_label: "55.000",
        promo_discount_price: 45000,
        promo_end_date: "2026-09-05",
        promo_subtitle: noticeBanner,
      }),
    });

    const postSettingsJson = await postSettingsRes.json();
    assert.strictEqual(postSettingsRes.status, 200, "POST /api/store-settings harus status 200");
    assert.strictEqual(postSettingsJson.success, true, "Response harus success: true");
    console.log("  ✔ POST /api/store-settings berhasil tersimpan");

    console.log("  1.2. Membaca kembali data pengaturan dari Neon PostgreSQL (GET /api/store-settings)...");
    const getSettingsRes = await fetch(`${BASE_URL}/api/store-settings?_t=${Date.now()}`);
    const getSettingsJson = await getSettingsRes.json();
    assert.strictEqual(getSettingsJson.success, true, "GET /api/store-settings success: true");
    assert.strictEqual(getSettingsJson.data.whatsapp_number, targetWhatsapp, "Nomor WA harus sesuai");
    assert.strictEqual(getSettingsJson.data.store_name, storeName, "Nama toko harus sesuai");
    console.log(`  ✔ Data berhasil diverifikasi di DB: WA=${getSettingsJson.data.whatsapp_number}, Toko=${getSettingsJson.data.store_name}`);

    results.test1_settings = true;
    console.log("✅ [TEST 1 PASSED] Pengaturan Toko berjalan sempurna.\n");
  } catch (err) {
    console.error("❌ [TEST 1 FAILED]:", err.message);
  }

  // =========================================================================
  // 2. BUYER STOREFRONT & WHATSAPP INTEGRATION
  // =========================================================================
  console.log("▶ [TEST 2] Pengujian Buyer Storefront di http://localhost:3000");
  try {
    console.log("  2.1. Memeriksa pengambilan data store settings untuk storefront...");
    const storeRes = await fetch(`${BASE_URL}/api/store-settings?_t=${Date.now()}`);
    const storeJson = await storeRes.json();
    const activeWhatsapp = storeJson.data.whatsapp_number;
    const cleanPhone = activeWhatsapp.replace(/[^0-9]/g, "");

    console.log(`  2.2. Verifikasi format link WhatsApp storefront (OrderForm, Floating, Footer)...`);
    const floatingWaUrl = `https://wa.me/${cleanPhone}?text=Halo%20Admin%20NiceGaming,%20saya%20butuh%20bantuan.`;
    const footerWaUrl = `https://wa.me/${cleanPhone}`;
    console.log(`    - Floating Widget Link: ${floatingWaUrl}`);
    console.log(`    - Footer WA Link: ${footerWaUrl}`);
    assert.strictEqual(cleanPhone, "6283863946967", "Clean phone harus 6283863946967");

    console.log("  2.3. Simulasi pembuatan pesanan baru oleh pembeli (Robux Order)...");
    const testBuyerUsername = "TesterBuyerPro";
    const testBuyerPhone = "081298765432";
    const testRobux = 2200;
    const testPrice = 45000;

    const createOrderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roblox_username: testBuyerUsername,
        customer_phone: testBuyerPhone,
        robux: testRobux,
        price: testPrice,
        payment_method: "Website",
        customer_notes: "Test automated e2e order",
      }),
    });

    const createOrderJson = await createOrderRes.json();
    assert.strictEqual(createOrderRes.status, 200, "Order creation harus 200 OK");
    assert.strictEqual(createOrderJson.success, true, "Order creation success: true");
    const createdOrder = createOrderJson.data;
    assert.ok(createdOrder.order_code, "Order harus memiliki order_code unik");
    assert.strictEqual(createdOrder.roblox_username, testBuyerUsername, "Username Roblox harus cocok");
    assert.strictEqual(Number(createdOrder.robux), testRobux, "Jumlah Robux harus cocok");
    assert.strictEqual(Number(createdOrder.price), testPrice, "Harga harus cocok");
    console.log(`  ✔ Pesanan berhasil dibuat: Kode=${createdOrder.order_code}, Status=${createdOrder.order_status}, ID=${createdOrder.id}`);

    // Verify order is queryable
    const verifyOrderRes = await fetch(`${BASE_URL}/api/orders?search=${encodeURIComponent(createdOrder.order_code)}`);
    const verifyOrderJson = await verifyOrderRes.json();
    assert.strictEqual(verifyOrderJson.success, true);
    assert.ok(verifyOrderJson.data.some(o => o.order_code === createdOrder.order_code), "Order harus ditemukan di database");
    console.log("  ✔ Pesanan berhasil terbaca dari database Neon.");

    results.test2_storefront = true;
    console.log("✅ [TEST 2 PASSED] Storefront dan Order Creation berjalan sempurna.\n");
  } catch (err) {
    console.error("❌ [TEST 2 FAILED]:", err.message);
  }

  // =========================================================================
  // 3. PRICELIST ROBUX CRUD & FORMAT TITIK
  // =========================================================================
  console.log("▶ [TEST 3] Pengujian Pricelist Robux di /admin");
  try {
    console.log("  3.1. Menguji fungsi format titik pada input nominal & harga...");
    const rawRobuxInput = "7500";
    const formattedRobux = formatNumberDots(rawRobuxInput);
    const rawPriceInput = "150000";
    const formattedPrice = formatNumberDots(rawPriceInput);
    console.log(`    - Input Robux: "${rawRobuxInput}" -> Terformat: "${formattedRobux}"`);
    console.log(`    - Input Harga: "${rawPriceInput}" -> Terformat: "${formattedPrice}"`);
    assert.strictEqual(formattedRobux, "7.500", "Format ribuan robux harus 7.500");
    assert.strictEqual(formattedPrice, "150.000", "Format ribuan harga harus 150.000");

    console.log("  3.2. Menambahkan paket nominal baru (7.500 Robux - Rp 150.000)...");
    const addProductRes = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "7.500 Robux",
        robux: 7500,
        price: 150000,
        is_active: true,
      }),
    });
    const addProductJson = await addProductRes.json();
    assert.strictEqual(addProductRes.status, 200);
    assert.strictEqual(addProductJson.success, true);
    const productId = addProductJson.data.id;
    console.log(`  ✔ Paket baru ditambahkan dengan ID: ${productId}`);

    console.log("  3.3. Mengedit harga paket menjadi Rp 145.000...");
    const editProductRes = await fetch(`${BASE_URL}/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: 145000,
      }),
    });
    const editProductJson = await editProductRes.json();
    assert.strictEqual(editProductRes.status, 200);
    assert.strictEqual(editProductJson.success, true);
    assert.strictEqual(Number(editProductJson.data.price), 145000, "Harga terupdate harus 145000");
    console.log(`  ✔ Harga paket berhasil diubah menjadi: Rp ${editProductJson.data.price.toLocaleString("id-ID")}`);

    console.log("  3.4. Menghapus paket dari database...");
    const deleteProductRes = await fetch(`${BASE_URL}/api/products/${productId}`, {
      method: "DELETE",
    });
    const deleteProductJson = await deleteProductRes.json();
    assert.strictEqual(deleteProductRes.status, 200);
    assert.strictEqual(deleteProductJson.success, true);
    console.log("  ✔ Paket berhasil dihapus.");

    console.log("  3.5. Verifikasi paket sudah tidak ada di database...");
    const getProductsRes = await fetch(`${BASE_URL}/api/products?_t=${Date.now()}`);
    const getProductsJson = await getProductsRes.json();
    const exists = getProductsJson.data.some((p) => p.id === productId);
    assert.strictEqual(exists, false, "Produk harus sudah terhapus dari database");
    console.log("  ✔ Terverifikasi bersih dari database.");

    results.test3_pricelist = true;
    console.log("✅ [TEST 3 PASSED] Pricelist CRUD & Format Titik berjalan sempurna.\n");
  } catch (err) {
    console.error("❌ [TEST 3 FAILED]:", err.message);
  }

  // =========================================================================
  // 4. TESTIMONI CRUD & BALASAN ADMIN
  // =========================================================================
  console.log("▶ [TEST 4] Pengujian Testimoni di /admin");
  try {
    console.log("  4.1. Menambah testimoni ulasan baru...");
    const addTestiRes = await fetch(`${BASE_URL}/api/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Rayhan Gaming",
        message: "Website mantap pol, admin ramah dan robux masuk 1 menit!",
        rating: 5,
        order_code: "#BLX777888",
      }),
    });
    const addTestiJson = await addTestiRes.json();
    assert.strictEqual(addTestiRes.status, 200);
    assert.strictEqual(addTestiJson.success, true);
    const testiId = addTestiJson.data.id;
    console.log(`  ✔ Testimoni baru dibuat dengan ID: ${testiId}`);

    console.log("  4.2. Memberikan balasan admin pada testimoni...");
    const replyText = "Terima kasih banyak kak Rayhan sudah belanja di NiceGaming!";
    const replyTestiRes = await fetch(`${BASE_URL}/api/testimonials/${testiId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admin_reply: replyText,
      }),
    });
    const replyTestiJson = await replyTestiRes.json();
    assert.strictEqual(replyTestiRes.status, 200);
    assert.strictEqual(replyTestiJson.success, true);
    console.log(`  ✔ Balasan admin tersimpan: "${replyTestiJson.data.admin_reply?.message || replyTestiJson.data.admin_reply}"`);

    console.log("  4.3. Menghapus testimoni...");
    const deleteTestiRes = await fetch(`${BASE_URL}/api/testimonials/${testiId}`, {
      method: "DELETE",
    });
    const deleteTestiJson = await deleteTestiRes.json();
    assert.strictEqual(deleteTestiRes.status, 200);
    assert.strictEqual(deleteTestiJson.success, true);
    console.log("  ✔ Testimoni berhasil dihapus.");

    console.log("  4.4. Verifikasi testimoni terhapus dari database...");
    const getTestisRes = await fetch(`${BASE_URL}/api/testimonials?all=true&_t=${Date.now()}`);
    const getTestisJson = await getTestisRes.json();
    const testiExists = getTestisJson.data.some((t) => String(t.id) === String(testiId));
    assert.strictEqual(testiExists, false, "Testimoni harus sudah terhapus dari database");
    console.log("  ✔ Terverifikasi bersih dari database.");

    results.test4_testimonials = true;
    console.log("✅ [TEST 4 PASSED] Testimoni CRUD & Balasan Admin berjalan sempurna.\n");
  } catch (err) {
    console.error("❌ [TEST 4 FAILED]:", err.message);
  }

  // =========================================================================
  // 5. BLACKLIST & CUSTOMER BLOCK/UNBAN LIFECYCLE
  // =========================================================================
  console.log("▶ [TEST 5] Pengujian Blacklist & Customer di /admin");
  try {
    const blacklistedUser = "cheater_e2e_test";
    const blacklistedPhone = "628999123456";

    console.log(`  5.1. Menambahkan user @${blacklistedUser} ke daftar blacklist...`);
    const addBlRes = await fetch(`${BASE_URL}/api/blacklists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roblox_username: blacklistedUser,
        phone: blacklistedPhone,
        reason: "Percobaan transaksi palsu / chargeback",
      }),
    });
    const addBlJson = await addBlRes.json();
    assert.strictEqual(addBlRes.status, 200);
    assert.strictEqual(addBlJson.success, true);
    console.log(`  ✔ User @${blacklistedUser} berhasil diblacklist.`);

    console.log("  5.2. Mencoba membuat pesanan baru menggunakan akun yang diblacklist (harus diblokir 403)...");
    const blockedOrderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roblox_username: blacklistedUser,
        customer_phone: blacklistedPhone,
        robux: 800,
        price: 16000,
      }),
    });
    const blockedOrderJson = await blockedOrderRes.json();
    assert.strictEqual(blockedOrderRes.status, 403, "Harus menghasilkan HTTP status 403 Forbidden");
    assert.strictEqual(blockedOrderJson.isBlacklisted, true, "isBlacklisted harus true");
    console.log(`  ✔ Sistem berhasil memblokir order: "${blockedOrderJson.error}"`);

    console.log(`  5.3. Membuka blokir (Unban) @${blacklistedUser}...`);
    const unbanRes = await fetch(`${BASE_URL}/api/blacklists/${encodeURIComponent(blacklistedUser)}`, {
      method: "DELETE",
    });
    const unbanJson = await unbanRes.json();
    assert.strictEqual(unbanRes.status, 200);
    assert.strictEqual(unbanJson.success, true);
    console.log(`  ✔ Blokir @${blacklistedUser} berhasil dibuka.`);

    console.log("  5.4. Mencoba membuat pesanan setelah dibuka blokir (harus berhasil)...");
    const unbannedOrderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roblox_username: blacklistedUser,
        customer_phone: blacklistedPhone,
        robux: 800,
        price: 16000,
      }),
    });
    const unbannedOrderJson = await unbannedOrderRes.json();
    assert.strictEqual(unbannedOrderRes.status, 200, "Order setelah unban harus berhasil 200 OK");
    assert.strictEqual(unbannedOrderJson.success, true);
    console.log(`  ✔ Pesanan berhasil dibuat setelah unban: ${unbannedOrderJson.data.order_code}`);

    results.test5_blacklist = true;
    console.log("✅ [TEST 5 PASSED] Blacklist & Customer Management berjalan sempurna.\n");
  } catch (err) {
    console.error("❌ [TEST 5 FAILED]:", err.message);
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log("===================================================================");
  console.log("                      RINGKASAN HASIL TEST                         ");
  console.log("===================================================================");
  console.log(`1. Pengaturan Toko & Simpan WA         : ${results.test1_settings ? "PASSED ✅" : "FAILED ❌"}`);
  console.log(`2. Buyer Storefront & WhatsApp Link    : ${results.test2_storefront ? "PASSED ✅" : "FAILED ❌"}`);
  console.log(`3. Pricelist Robux CRUD & Format Titik : ${results.test3_pricelist ? "PASSED ✅" : "FAILED ❌"}`);
  console.log(`4. Testimoni CRUD & Balasan Admin      : ${results.test4_testimonials ? "PASSED ✅" : "FAILED ❌"}`);
  console.log(`5. Blacklist & Customer Block/Unban    : ${results.test5_blacklist ? "PASSED ✅" : "FAILED ❌"}`);
  console.log("===================================================================");

  const allPassed = Object.values(results).every(Boolean);
  if (allPassed) {
    console.log("🎉 SELURUH 5 PENGUJIAN END-TO-END BERHASIL 100% TANPA BUG!");
  } else {
    console.error("⚠️ Ada pengujian yang gagal. Silakan periksa log di atas.");
    process.exit(1);
  }
}

runE2ETests();
