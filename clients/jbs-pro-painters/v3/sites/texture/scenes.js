import homeAfter from '../../img/home-after.jpg'
import homeBefore from '../../img/home-before.jpg'
import gdoorAfter from '../../img/gdoor-after.jpg'
import homeAfterSm from '../../img/home-after-sm.jpg'
import homeBeforeSm from '../../img/home-before-sm.jpg'
import gdoorAfterSm from '../../img/gdoor-after-sm.jpg'

// Wall polygons and holes are percent coordinates of the photo (hand placed). Photos are real JB'S jobs.
const gilbertWalls = [
  [[7.5, 46.5], [22, 37], [41, 44], [44.5, 47], [44.5, 61], [38, 63], [25, 62], [12, 61.5], [8, 58]],
  [[54, 46], [68, 38.5], [85, 45.5], [85.5, 63], [79, 64], [57, 64], [54.5, 62]],
]
const gilbertHoles = [
  [[14, 45], [29.5, 45], [29.5, 61.5], [14, 61.5]], [[29.8, 44], [34.2, 44], [34.2, 66], [29.8, 66]], [[38.2, 49], [42.8, 49], [42.8, 63.5], [38.2, 63.5]],
  [[57.5, 46.8], [80, 46.8], [80, 64.5], [57.5, 64.5]], [[74, 41], [77, 41], [77, 47], [74, 47]],
]
export const SCENES = [
  { id: 'gilbert', title: 'Gilbert home, finished', thumb: homeAfterSm, src: homeAfter, alt: 'A Gilbert stucco home finished in neutral tones with brown garage doors', walls: gilbertWalls, holes: gilbertHoles, tol: 0.055 },
  {
    id: 'gilbert-before', title: 'Same home, before', thumb: homeBeforeSm, src: homeBefore, alt: 'The same Gilbert home in its original orange stucco',
    walls: [
      [[3.5, 29], [20, 21], [40, 33], [46, 38.5], [46, 58], [38, 58.5], [20, 57.5], [5, 57.5]],
      [[58, 40], [75, 29], [96, 38], [96, 60.5], [78, 60.5], [60, 60]],
    ],
    holes: [
      [[9.5, 39], [19, 39], [19, 55.5], [9.5, 55.5]], [[21.5, 39], [29, 39], [29, 55.5], [21.5, 55.5]], [[30, 38], [35, 38], [35, 63], [30, 63]],
      [[39, 42], [45, 42], [45, 62], [39, 62]], [[60, 42], [90, 42], [90, 62], [60, 62]], [[91.5, 40], [94, 40], [94, 62], [91.5, 62]], [[19, 26], [24.5, 26], [24.5, 34], [19, 34]], [[72, 33], [77, 33], [77, 40], [72, 40]],
    ],
    tol: 0.075,
  },
  {
    id: 'corner', title: 'Stucco corner', thumb: gdoorAfterSm, src: gdoorAfter, alt: 'A stucco home with deep green-gray garage doors',
    walls: [
      [[10, 33], [33, 33], [55, 35.5], [57, 36], [57, 64], [10, 64]],
      [[57, 36], [60, 34], [74, 23.5], [100, 14], [100, 67], [76, 67], [68, 66], [57, 64]],
    ],
    holes: [
      [[15, 38], [53.5, 38], [53.5, 64], [15, 64]], [[10.5, 40], [14, 40], [14, 48], [10.5, 48]], [[55, 42], [58, 42], [58, 49], [55, 49]],
      [[61, 39], [70, 39], [70, 64], [61, 64]], [[71.5, 37], [76, 37], [76, 48], [71.5, 48]], [[90.5, 36], [100, 36], [100, 60], [90.5, 60]], [[82, 62], [86, 62], [86, 68], [82, 68]],
    ],
    tol: 0.05,
  },
]
