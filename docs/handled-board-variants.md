# Handled board preview variants

Source checked in the visible Etsy listing on 2026-10-16:
https://www.etsy.com/de/listing/4417507555/

- Oak: made to order, approximately 60 x 40 x 5 cm according to the current description. Existing photograph represents the sold original (59.5 x 38 x 4.9 cm), not a promise of identical grain on a new board.
- Tropical hardwood: available, approximately 44.2 x 36 x 5 cm. Reuses the existing photographed model.
- Beech: available, approximately 50 x 37 x 5 cm. Photo 6 confirms dimensions; its central wood surface supplies the texture, excluding dimension annotations.
- The standalone tropical listing 4451487112 and its model remain intact.

The three variants share a rounded outline and underside handle taper. The owner confirmed a common workshop template. Corner rounding and side/rear grain remain visual approximations, not measured CAD specifications. No generated wood photograph is used.

The dedicated species selector changes model, physical dimensions and availability note while retaining the combined listing as the purchase destination. Saved comparisons distinguish model keys from listing IDs, allowing two woods from the same listing to coexist. Existing saved views without a model key remain readable.

This change does not synchronize the wider product catalog, change pricing, or modify the Search/Citation release branch. The current general product catalog still describes the original oak reference; a full multi-variant catalog/pricing model is outside this preview change.

## Verification

- 16 preview geometry/holder tests and 17 existing Finder tests pass.
- Production preview rebuild succeeds. Existing perspective-transform CommonJS warning remains; no vendor refactor included.
- Browser: all three woods in flat and holder views; distinct wood-coloured scene pixels verified in screenshots. Final beech frame checked after texture loading.
- Desktop 1440 px and mobile 375/430 px: no horizontal page overflow. New species menu has a 44 px minimum touch height.
- Worktop placement checked using the existing owner-provided kitchen example, with visible oak and beech overlays after rendering completed.
- Two models under listing 4417507555 saved simultaneously without replacing one another.
- Standalone 4451487112 still opens its own model and purchase destination, without the combined-listing species selector.
- English species labels and direct variant selection checked. Real iPhone Safari was not tested.
