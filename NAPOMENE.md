# Sajt dr Dragane Radojković Šarić — napomene za predaju

Statičan sajt (HTML/CSS/JS, bez build koraka). Otvorite `index.html` u pregledaču.

## Stranice

| Fajl | Namena |
|---|---|
| `index.html` | Početna (sekcije A–J iz brifa) |
| `o-doktorki.html` | Biografija |
| `razvoj-deteta.html` | Edukativna biblioteka sa filterom kategorija (`#disanje-navike`, `#mlecni-zubi`...) |
| `clanak-disanje-na-usta.html` | Šablon članka + jedan kompletan tekst (**nacrt**) |
| `vodic.html` | Landing stranica vodiča, bez navigacije |
| `program.html` | Stranica programa Miostart |
| `kontakt.html` | Konsultacija i forma za upit |
| `politika-privatnosti.html` | Struktura politike (potreban pravnik) |

## Verifikovani izvori

- **razvojlica.ortodont.rs**: naslov vodiča (sa korice), lista „U njemu ćete saznati”, „Ovaj vodič je za vas ako”, biografija, citat. Postojeća forma je Zoho Forms iframe.
- **razvojlica.ortodont.rs/ponuda/program/**: naziv, publika, sadržaj, 4 nedelje, 8–12 min, 1× (po potrebi 2×) dnevno, PDF, **19 €**, plaćanje karticom, citati autorke, „mama troje dece”, „specijalista ortopedije vilica”.
- **ortodont.rs/kontakt**: adresa, telefon, e-pošta, radno vreme, usluge.
- **Instagram**: objave nisu javno čitljive. Teme članaka su preuzete samo iz brifa.
- Fotografije su preuzete sa postojećeg sajta (`assets/img/`).

## Šta mora da potvrdi doktorka (na sajtu označeno šrafiranim poljem)

1. Broj „500+ pacijenata” i da li je i dalje tačan.
2. Obrazovanje: fakultet, specijalizacija, godine, članstva, sertifikati.
3. Program: teme po nedeljama, uzrast deteta, rad uz ortodontsku terapiju ili logopeda, način isporuke PDF-a, uslovi i povraćaj novca.
4. Konsultacija: trajanje, sadržaj, cena, šta poneti.
5. Članak o disanju na usta: stručna provera celog teksta i datum objave. Ostalih 6 članaka je označeno kao „Tekst u pripremi”.
6. Adresa: na ortodont.rs piše „Strahinjica bana”, a ovde je ispravljeno u **Strahinjića bana**.
7. E-adresa `dragana.dentist@mail.com` je preuzeta kakva jeste. Treba proveriti da li je ispravna (nije možda @gmail.com).

## Namerno ublažene tvrdnje

Prema brifu (bez medicinskih obećanja), ovo sa postojećih stranica **nije preneto**:
- vodič: „sprečavate više od polovine potencijalnih problema”, „eliminišete uzroke problema sa koncentracijom”;
- program: „Reši … iz korena”, „sprečavaju krivljenje zuba”, „povećavaju dotok kiseonika za mozak”, „daje rezultate koji traju”, „brži i efikasniji rezultati”;
- precrtana cena „89 €”, jer bez provere deluje kao lažno sniženje.

Vežbe su predstavljene kroz ono na šta su **usmerene**, a ne kroz zagarantovane ishode.

## Integracije (`js/main.js` → `CONFIG`)

- `guideFormEndpoint`, `contactFormEndpoint`: dok su prazni, forma posle validacije prikazuje poruku da integracija nije podešena i daje link ka postojećoj stranici vodiča. **Lažna potvrda se nikad ne prikazuje.** Forma šalje `ime`, `email`, `saglasnost`, `edukativne_poruke` (FormData POST). Nazive polja uskladiti sa izabranim servisom (Zoho, MailerLite, Brevo…). Druga mogućnost je ugrađivanje postojećeg Zoho iframe-a.
- `analyticsId`: GA4 se učitava tek kada posetilac prihvati analitičke kolačiće.
- Praćeni događaji (`data-track`): `guide_cta_click`, `guide_form_submit`, `guide_signup_success`, `program_cta_click`, `program_checkout_click`, `consultation_cta_click`, `consultation_form_submit`, `consultation_request_success`, `consultation_phone_click`, `consultation_email_click`.
- Kupovina vodi na postojeći checkout: `razvojlica.ortodont.rs/ponuda/program/#form`. Praćenje završene kupovine treba podesiti na samom checkout-u (WooCommerce/Stripe).

**Pregled stanja forme** za dizajn reviziju: dodajte `?stanje=uspeh` ili `?stanje=greska` na URL.

## SEO

- Meta naslovi i opisi su postavljeni na svakoj stranici.
- `DOMEN.rs` u `canonical` zameniti stvarnim domenom.
- JSON-LD: `Dentist` (početna), `Person`, `Article`, `Product`.
- Lokalni SEO samo za Beograd (adresa je verifikovana).

## Pre objave

- Konvertovati PNG fotografije u WebP (portret je 1,5 MB).
- Pravni pregled politike privatnosti i saglasnosti (ZZPL).
- Na ortodont.rs nema linka ka Instagramu. Profil je ovde povezan na osnovu brifa.
