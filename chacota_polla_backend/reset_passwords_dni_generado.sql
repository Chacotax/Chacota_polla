PRAGMA foreign_keys = ON;

-- Reset de contraseñas: usuario = DNI y contraseña = DNI
-- No modifica los primeros 5 usuarios
-- Generado usando createPassword() del backend

UPDATE usuarios
SET
  usuario = '60868978',
  password_hash = '389625cc0d5fcb3734030d79b95018de6f1af0375e073fb7d56715236d097338',
  password_salt = 'Zye4jK5d4QrN7zChJVchBW6P',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 6;

UPDATE usuarios
SET
  usuario = '44048256',
  password_hash = 'ce0cdae9182a5a9cc9d6b0b04718877add4ff1f67c55a2d4a6c007da19f95c89',
  password_salt = 'VuO9ydYbTf5uJkAGE9lHQ265',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 7;

UPDATE usuarios
SET
  usuario = '76795542',
  password_hash = 'fb79f02311972fe249191ca47623638f8135d437362ee549c6fe950bc7a88cd5',
  password_salt = 'BSZU9GFHjoaBShgUklmkM9yz',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 8;

UPDATE usuarios
SET
  usuario = '46741700',
  password_hash = '8446e5135f7eae0414fb981f1e3e7a00b838cf3eead7ff355e2672dcc86f4b88',
  password_salt = 'd3znh6SSZ64eZAXjKi78QKEm',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 9;

UPDATE usuarios
SET
  usuario = '76455701',
  password_hash = '7bd8f330f50ac5f0cc9c7a634e9958f45c3b3d3720042c85765fcd5a223a765b',
  password_salt = '0UTyAOjXCkuGXzBFVVXyhxnH',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 10;

UPDATE usuarios
SET
  usuario = '45558979',
  password_hash = 'b93aba9cdae544732abc8b9d0fcca02118899eed611a7a3ba40685852b9e1289',
  password_salt = 'tzOpi9fgiwrXj1owzgHAmCJy',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 11;

UPDATE usuarios
SET
  usuario = '44333908',
  password_hash = '50460a80b9a05b76dd1275fb4a1ce04f0f0fed8f8ac828ae6108b9129730624b',
  password_salt = 'jJdfvakH5MHp0aExMDDVLo6d',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 12;

UPDATE usuarios
SET
  usuario = '76427071',
  password_hash = '3b4022a22ccb3d4c742c12f62736bac758fab9e5486721fc6f6e21e3771559d1',
  password_salt = 'HGfRYuWpRXr7cPbKN7eOqvgQ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 13;

UPDATE usuarios
SET
  usuario = '09800105',
  password_hash = 'd3ca91e8e45992ef8b1982bf2637c7cc7baf0cd02a303da2a0341291c84b9ff2',
  password_salt = 'qg7fyJ8ilv0SP1X7FX2gZRI3',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 14;

UPDATE usuarios
SET
  usuario = '70934374',
  password_hash = '83d2dc7303addcb71a72799a2f53340cd04e4b203798f16199cfc02a35dd193c',
  password_salt = 'aLmdoC7AJ6VfKPU4xHGaT1jb',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 15;

UPDATE usuarios
SET
  usuario = '43231927',
  password_hash = 'c9875fa2100f5d55543b78f429904ac757c6edb7e368442e17bc7782b89b2e25',
  password_salt = 'wfRkpRKcL2SAyxGV7ZcFtkvt',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 16;

UPDATE usuarios
SET
  usuario = '61016119',
  password_hash = 'af39b0479e8d98cc617455dc43e7132ade185f38e490c40131aac96d6e431060',
  password_salt = 'EIM1zwKWqbK3A5SYPLLJZ5hc',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 17;

UPDATE usuarios
SET
  usuario = '40610124',
  password_hash = '2801a9ea272c06dd675c5d80231e11d6f4be6ba248f9a5608247a31f7b97f487',
  password_salt = 'f4oiAVxeYudq22vkaC7MKMdk',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 18;

UPDATE usuarios
SET
  usuario = '75744247',
  password_hash = '7d639e2894879721ce8ed47d3b2f16483ca616cc2e595ebab61a6262d12fa833',
  password_salt = 'LSdKEd8eOPVUq7vRMarrVMSR',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 19;

UPDATE usuarios
SET
  usuario = '09902449',
  password_hash = '04434ddb46187b51b02db4e812794bcb7617609f930534cc523df818b0582061',
  password_salt = 'hBxu3H3HRau3AccMnCzaWCFK',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 20;

UPDATE usuarios
SET
  usuario = '40892651',
  password_hash = '022164afc89998284c36db4ac88ad0f1a6e7d4aa2cafbf796095283e129a853a',
  password_salt = 'RthbBwcH7lV4WWyGjuIA8ZIf',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 21;

UPDATE usuarios
SET
  usuario = '45512543',
  password_hash = '8688eef542cbc061117758c3ce9d3a95848d057424a006412d932d7c2c808e60',
  password_salt = 'O80sC9jsEvDPMiTRZQbSCXsv',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 22;

UPDATE usuarios
SET
  usuario = '10791390',
  password_hash = 'c1bb81c7f974ed52d45dbe586b7be61e6a99432874913f930fdd227b65e5a4ce',
  password_salt = 'tB4cP7yk5Bxc19lkTJzDpv95',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 23;

UPDATE usuarios
SET
  usuario = '42764823',
  password_hash = '6057f25f02cb28b1e940aec4000709d0c728a0d5238a1be0f263450187dba896',
  password_salt = 'bK6V7zR8Eqrcky5SfTTI9xb7',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 24;

UPDATE usuarios
SET
  usuario = '73174115',
  password_hash = 'e7bedd24da0676b05519e362eef9f728098a3e294de7f759335553b293901a41',
  password_salt = 'zF23cR4yvjGZ2zArLxYYH66L',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 25;

UPDATE usuarios
SET
  usuario = '76749997',
  password_hash = 'b26773afab6c02125bc455cdbcf2bc13d02527caa5905a5eac8b2a875a031769',
  password_salt = 'oh8I0Ze8SoTH9j22vuuLMVbs',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 26;

UPDATE usuarios
SET
  usuario = '43849403',
  password_hash = '0d955e8b461621f75c177398be20f8764b0f575e7f02d6b8f988d3af34decf99',
  password_salt = '5HsGL2cb9duX4KMY6uziPthT',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 27;

UPDATE usuarios
SET
  usuario = '73244463',
  password_hash = '4349edf5ba3f8c78643880d7f883bc5145f3ab83da6aa624485d8c09db912deb',
  password_salt = '3qlIc1IZ0YOtB46gpZFXEbev',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 28;

UPDATE usuarios
SET
  usuario = '41214950',
  password_hash = 'bf050af21c8f5393f656cbe108537626255bed838eb6b129b521c1e08eb1378b',
  password_salt = 'Lkxhpyg1NSwuFgKUqWm8fd4F',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 29;

UPDATE usuarios
SET
  usuario = '46830914',
  password_hash = '40d0713b9978b659c08c8acf52a588390f433629248ba10ad1955583d6420853',
  password_salt = '5e7XqWJSVippDF9LlAt3pmW4',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 30;

UPDATE usuarios
SET
  usuario = '42164720',
  password_hash = '86358f506ed22900a9c658ddcfabbc39d69fbb9223bc8cb8a98a406d9ab74921',
  password_salt = 'W94LvKZqRuw5D5WUizn67Qt8',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 31;

UPDATE usuarios
SET
  usuario = '72957499',
  password_hash = 'f540a4363a3fcd6dd5e9904b46c39c38803bb52cb5fab9925b8d92a1d699507f',
  password_salt = 'GEk38RK6g6FMN1w90qc9Fs3Q',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 32;

UPDATE usuarios
SET
  usuario = '10628152',
  password_hash = 'a6b1c44d53b6ed3b9ba371fef1b667a443074fa23070202570ac048059f5e551',
  password_salt = 'CYvbUByKfsunqrUsfqYS2qoB',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 33;

UPDATE usuarios
SET
  usuario = '43548898',
  password_hash = '9a4e2d46a2c8e654877fafb79f9e6790824b71180d1d1fa1dc9273bb52ce3802',
  password_salt = 'iu01pneMWB8Rys8uY8mSzrlC',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 34;

UPDATE usuarios
SET
  usuario = '74643646',
  password_hash = '4af433eb21416dc938b9f1ee5f65313740f8aa3c5bfa822562abec9d1bd85458',
  password_salt = 'GDYp9gKRxMTf30fcFFoI7IuZ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 35;

UPDATE usuarios
SET
  usuario = '45543740',
  password_hash = '96b48d291a435b4763734c9fa1f33b9fe442e3e574cb846f45133cd412bc045b',
  password_salt = 'WkazofzSUxywG3TgBGmWxfPx',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 36;

UPDATE usuarios
SET
  usuario = '45906725',
  password_hash = '8d91c985cc8e6ac88d6f57a920d7f1c0dc17561aebdcb80bc31dc449c996aa38',
  password_salt = 'DlTlMBdAL1LNWQQKAjBthWj5',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 37;

UPDATE usuarios
SET
  usuario = '41669850',
  password_hash = '55d820d3dee59a4eddf893c9d72747ce125069d0250acd8f11e50fd6276a1caf',
  password_salt = 'NhqDlvKeeHPTIdfVozUWVa0m',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 38;

UPDATE usuarios
SET
  usuario = '74646007',
  password_hash = '1a88f6fe802523a96c4dd236a8a97b3c9834ce7fc42ec53376e4aa4bf60f1eff',
  password_salt = 'LSR5PJaukCsGEZk7BENU89hJ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 39;

UPDATE usuarios
SET
  usuario = '71730233',
  password_hash = 'f369630a38d3e0540affb7e7914d63f3b64cc15c0a7b9d09d941a7d2312c2010',
  password_salt = 'V6nQ6TaAQFPYcU4RIFUro0Ql',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 40;

UPDATE usuarios
SET
  usuario = '47184703',
  password_hash = '4b0e548642e031fc5d405e446fcdf48e089babb1419f2f90d2dd801d0709f81b',
  password_salt = 'wl14ffoclelQG5MOfCc9lGjg',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 41;

UPDATE usuarios
SET
  usuario = '18149491',
  password_hash = '58a3c7271d08245ef6ac4914dbd8cecdbe0ea4205a46afb743e59384e3298c9e',
  password_salt = 'L419XoKH8bDYkfPGERaH0OPD',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 42;

UPDATE usuarios
SET
  usuario = '41703326',
  password_hash = '52c2d71d3209ee40dbf1f70173b2cd6bcde90f656a6490b234313346c3ac8f3c',
  password_salt = 'eornajo6TNOZ6B4FW1SAHI8E',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 43;

UPDATE usuarios
SET
  usuario = '40671199',
  password_hash = '27fd0d18f1d6ef351f037797d419f25b031f5670caa1284d0916aaa84691adcd',
  password_salt = '3PljM1G5PVMWqSlPpg9WJeog',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 44;

UPDATE usuarios
SET
  usuario = '70695026',
  password_hash = 'c9a04a7f4db99ef01d0280c5d5f8613f0fb9f062e9e32f263c3ba0b034f570b9',
  password_salt = 'rZB4rLy8dHmW2IGh4F8Rcm2B',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 45;

UPDATE usuarios
SET
  usuario = '44999061',
  password_hash = 'a2ab3ec3324cab64a6828cda5a41f2946e081863cb75a39b3517f66abb24fe7a',
  password_salt = 'TnNxDGfqukCN9qIRSLel24Xg',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 46;

UPDATE usuarios
SET
  usuario = '40480039',
  password_hash = 'e4c1a5d13723ee421058657d0714bc77e4f4f8fe0f92f97c0b2d04678ea181f7',
  password_salt = 'UCIEvXFaSI7P5D94tq62m6jz',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 47;

UPDATE usuarios
SET
  usuario = '42213501',
  password_hash = 'a06ed7b2ffd759dcbd494dcc428cee3958d7e9e29acf45ff5b76d2798e53359c',
  password_salt = 'nh7DkkWUe6Nl6aQDUlTKZ2bq',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 48;

UPDATE usuarios
SET
  usuario = '09422767',
  password_hash = '9798a8a5d811fbb72d1f85d8598ef3f444663968e7aad61502dc2464547660c2',
  password_salt = 'xHElch4YF6azHNkKG0kH15uD',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 49;

UPDATE usuarios
SET
  usuario = '06774483',
  password_hash = '57423d717c1295a35714be788099453f6c1f7e7697f8d969b42cda6181e603bf',
  password_salt = 'AFzD1ovdICgq9LooFdP92rgK',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 50;

UPDATE usuarios
SET
  usuario = '004549595',
  password_hash = 'a491009649198610261298568c7aae7ead20a34d0b81f5562a26fef5ebfee2a0',
  password_salt = '1S48LnWSjm3iGC7WOYgH1bzD',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 51;

UPDATE usuarios
SET
  usuario = '45852023',
  password_hash = '4a771194ab1acbfb7b34970aef1388e182d9264e4a84c2db162e29a889896e97',
  password_salt = 'X6ZqgXLXFbdc4jhTZ4DXhLIC',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 52;

UPDATE usuarios
SET
  usuario = '07064771',
  password_hash = 'a181e917694441f51b83c78b6f6c8a5d3bafcfa3513879591799456e4b4df869',
  password_salt = 'TAlAjxjyCPZp0ooZ0hcavQKS',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 53;

UPDATE usuarios
SET
  usuario = '00507214',
  password_hash = '7212fea88af31fcdcc26523086baed10c210f9d20d3af1cd093d55049af2036a',
  password_salt = 'Mwsy5roD1AFmniIyvmEGy341',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 54;

UPDATE usuarios
SET
  usuario = '46087910',
  password_hash = 'ce746e60beb0e50f44539dc2ee347e6fcba0aa0ad85cb58d82a1811626f6f8dd',
  password_salt = 'XBmxO5bDU4690OleF5RGjnFW',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 55;

UPDATE usuarios
SET
  usuario = '47821622',
  password_hash = 'c78fd9d4be2274816241df4422e4870cfc86fe616311468df44b4f0bfa998ad3',
  password_salt = 'Ib2ForHqLHwmP8Ox0z1mKOiC',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 56;

UPDATE usuarios
SET
  usuario = '72087426',
  password_hash = '3cd132d487bc7145019b409043df0b1407144a4f898502d881bfd85973337ede',
  password_salt = '7xSrf4sMezhFaHGRU0W2aYEZ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 57;

UPDATE usuarios
SET
  usuario = '46262376',
  password_hash = '2124d396ccbdbf0285bbba94bb4f37f5cb8e0c40fbcf549e164c5fdf7533dc87',
  password_salt = 'VJSQ8yT2PVzWzc8e6uho0AMV',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 58;

UPDATE usuarios
SET
  usuario = '44905660',
  password_hash = '479771934570328d3bf2eecef3a9fae1cc55bfd43326c31f70024abbf9ebc936',
  password_salt = 'ng8uvFYZFSRELGYVhpOZOANQ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 59;

UPDATE usuarios
SET
  usuario = '75939851',
  password_hash = '2c8753ca1dc47df701374d389b734084e1d5af74487427e363a8ef70efd60d5c',
  password_salt = 'buqOhY0O1ghqc7NTd2jDqj2d',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 60;

UPDATE usuarios
SET
  usuario = '20031393',
  password_hash = '58af4c961410da4f03a516dc9ffea5a791ba65b93c9ab14971bee09fe362e852',
  password_salt = 'XU314xmflW0UmIfmrDWKDgP9',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 61;

UPDATE usuarios
SET
  usuario = '75419379',
  password_hash = 'd41de116d4e9a9b03d009fa833482533843bf9097bc90ed15c80d62e26cefb37',
  password_salt = 'aU6zIEz1YexhiCotBgiVSArT',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 62;

UPDATE usuarios
SET
  usuario = '74296520',
  password_hash = '0ba06f3406601ebd72a1f50a15ecf5422ade3804c29a62c7ad66da669581175d',
  password_salt = 'YZTbNDC3t4oGcBa4Pe3sGIB7',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 63;

UPDATE usuarios
SET
  usuario = '70038913',
  password_hash = '5e55016026e3d20e8f58dbf683e94edb736b6e4a127afcbe7decf3da1edf48c8',
  password_salt = '38Ix7wIMwGgOOVqJitDdMF0q',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 64;

UPDATE usuarios
SET
  usuario = '47488230',
  password_hash = '215246fe65a14d74dc96a8c9c4ad6f6a0960d35cb014b0bf3b05558bfecd0305',
  password_salt = 'abJmEuZnVq3GyXHJ3X3pLAlx',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 65;

UPDATE usuarios
SET
  usuario = '77221456',
  password_hash = '3d316f6756911d3edd754fabd67912a9b6e062333a1ef559aa3b059c03767e49',
  password_salt = 'zPSf0LE9vNxChDUxpXEJ85L1',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 66;

UPDATE usuarios
SET
  usuario = '41290885',
  password_hash = 'c5f08fb04ae702880e3d62431c3057f6a35b37fc6b1f816823033463cd34b245',
  password_salt = 'VqFqpNuAfdwOvBBnIpCQfOLA',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 67;

UPDATE usuarios
SET
  usuario = '46529146',
  password_hash = '9910ac949c948a150eb0d4b01f7bad0506f24931ded4e9be0a7b48de575e2960',
  password_salt = 'fM2DcriwGlR5Lw1FHEPcYYCm',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 68;

UPDATE usuarios
SET
  usuario = '73500181',
  password_hash = 'dddc6c27f49ba4b6f3f9b63da41ae00322a3438e657a771dae525c84af5f63d0',
  password_salt = 'lL8Uz4xg89nFKex82VjxNOxM',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 69;

UPDATE usuarios
SET
  usuario = '77887581',
  password_hash = '65acd3b8ac90e360b845e3605c6e90d628fcf417cb95cdca01c3cf99b78d3bd1',
  password_salt = '5BTwvocmt3TpZvuiYNgXc0aY',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 70;

UPDATE usuarios
SET
  usuario = '09581615',
  password_hash = '386ebf6491ecc943f897aa3a5fedccaf0f730adb4e20cf7b160e54d80a3b0bbb',
  password_salt = 'nQ84nVl3rvEkiHvxJ5isB49m',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 71;

UPDATE usuarios
SET
  usuario = '77125777',
  password_hash = '77bd9db94456782f81d7907961711b3916efd7886c33f9ba3d15161c31bb7920',
  password_salt = 'SsmD67UuTqoag3KWYoiql9RE',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 72;

UPDATE usuarios
SET
  usuario = '44138438',
  password_hash = '6e1a7ec86c5a23dd3dfab7170b2f85b93cf9074a9c7c63595ac6207ede25b2d5',
  password_salt = '2U3Uj0Y7Mlf7j47WPiM9W4Td',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 73;

UPDATE usuarios
SET
  usuario = '72281338',
  password_hash = '27583adfed4d6e1d32cc4a7dd8423bfdcee943bf6a019a39af8ee2302e6a19df',
  password_salt = 'sLzWQnAYRZujqAmgSoEsVK3q',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 74;

UPDATE usuarios
SET
  usuario = '74966637',
  password_hash = 'df1bdd5b9a1cb5116e7a904c9bc484ff6c25055b2f6c9378fd608cedc73ac485',
  password_salt = '3E9iHNlzhzlzznjkuHE5uyev',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 75;

UPDATE usuarios
SET
  usuario = '09500658',
  password_hash = 'de05f9d0ecfce9ef2fd73731373360ca0c6383cdff4b6d6b61f59eb56f9b36e7',
  password_salt = 'htm9PfCSawHz25xxMUBMe730',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 76;

UPDATE usuarios
SET
  usuario = '42072458',
  password_hash = '0d2bb042b7d059f500e491ebdf4a663568e69d527100af12e09b259e015d570e',
  password_salt = 'Uqicaev8ioJ4bvMByoHxKmHR',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 77;

UPDATE usuarios
SET
  usuario = '74749430',
  password_hash = 'af478b0a4de25017eefeb830141376e9d019f31700d367c9ec17fcfb9ecf35f0',
  password_salt = 'bByxNhrUzoHpMFPvXqaPiQIZ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 78;

UPDATE usuarios
SET
  usuario = '07556406',
  password_hash = 'fcb9b2c69fc41bea044dcfc616ac1b3e9bff3c4ba560b48350ea655b4fab8a4e',
  password_salt = '5UeAXNvM1LeiDG18utKgSReW',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 79;

UPDATE usuarios
SET
  usuario = '08792525',
  password_hash = '761709de2ee02337f2ec889e1601a8ea6ce9bed3af509332f2dca7f371ad844b',
  password_salt = '9083P3vykuVxb5Do79SC7Pdw',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 80;

UPDATE usuarios
SET
  usuario = '40750415',
  password_hash = 'b63bb007ca0c5457cedec9788779736bcd8248d62fe9498066664e7b33ad6017',
  password_salt = 'JTcjpG0ned2fQnYWEtDcpj4X',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 81;

UPDATE usuarios
SET
  usuario = '40194111',
  password_hash = '4f8314ec8c2145214650bdb7c0a1c342249b162c6355aef62a9f4a15fd36d2d4',
  password_salt = 'QVJvd1UeqUuqlJ5TDOJXKRn8',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 82;

UPDATE usuarios
SET
  usuario = '75838637',
  password_hash = '8463e6f2ecf5200f288eb3cea5298c46d086b95e4d27bc233c6aa689cc0b8bb8',
  password_salt = 'LHfzA7aWc7LZEG75vIA2lqEo',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 83;

UPDATE usuarios
SET
  usuario = '72803811',
  password_hash = '5594bb86eb3e1337b6fcb0fd0a96f4fc012df968ded9dd5f6f873d38065051d9',
  password_salt = 'B24ChBPl6PXGKRNfNq9ldSdu',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 84;

UPDATE usuarios
SET
  usuario = '10363339',
  password_hash = '72f6fc19fefa2f0aa1d319ae4f768efba41b49ee8292eed08673082dc81abf74',
  password_salt = 'iOYZk2B4MEXdBXRrp2K0ijiW',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 85;

UPDATE usuarios
SET
  usuario = '75889249',
  password_hash = 'd157363b003e282d06b1038a65b762ae7d9a9c9462d9e9661878c00a9d6d4534',
  password_salt = 'X9T7YEI7xh506sq0IAhQU8KX',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 86;

UPDATE usuarios
SET
  usuario = '74659514',
  password_hash = 'e55f2db42b7fe7cb07338d906d64cf9f7f01ca0224859d689721ba74e2f6a278',
  password_salt = 'XOlfVQlg6iClJmgvA1qpHPni',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 87;

UPDATE usuarios
SET
  usuario = '09821890',
  password_hash = '3a12a3501f840301f3fced9b3c5d8d653d6004682bb08642dfa88105903073e6',
  password_salt = 'loaxCnGecmg5R4HjPHpqKwHy',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 88;

UPDATE usuarios
SET
  usuario = '47383081',
  password_hash = 'd59d4c5594d057ff10e409a87de90fd73b31df4da9c8b28ddd3da6e9cfaa63c3',
  password_salt = 'rnrKU2cMexd3fJP0Jdst1qRR',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 89;

UPDATE usuarios
SET
  usuario = '06211716',
  password_hash = '0b01ac7d9de96269cc4fc90e2ee64192f941b9495d1276de82dc7207341b6a31',
  password_salt = 'OOYke5qPfzwQfMwRqlb8dtvU',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 90;

UPDATE usuarios
SET
  usuario = '43083141',
  password_hash = 'c6be3e896ad410db5219942d35b1091fcb18d73b4e7dff268b0ef72cbd151399',
  password_salt = 'RoUIDozSNzhifdm3JETUQy5k',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 91;

UPDATE usuarios
SET
  usuario = '76345722',
  password_hash = '08838b3c0fc05537836f7ddbb9c6ab3a94d54a502171ea77d906b995f0009453',
  password_salt = 'VAoQsJ7zZ6s1NTcVq3xE2Ref',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 92;

UPDATE usuarios
SET
  usuario = '73119177',
  password_hash = '15d2578a1fda0d3c9d51a3a12a0826a14c301b44d1ab270e96767f335e6a765b',
  password_salt = 'mXee8epca6R74v35vC1s5bRO',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 93;

UPDATE usuarios
SET
  usuario = '73426100',
  password_hash = 'e621b05085290e9c92effa8feec037dd9e0f2d664be540517e6abfb2dad5f71b',
  password_salt = 'gddSg1bfzkX0ukRIJZOYl7fy',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 94;

UPDATE usuarios
SET
  usuario = '10121574',
  password_hash = '6da8430d56a056bf41ef9fd018091acb04bff2632d6ca171dc2f112a3715f24e',
  password_salt = 'odgpSjvXG7mhushYVhemy55a',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 95;

UPDATE usuarios
SET
  usuario = '45789431',
  password_hash = 'c72cd680f25bc35dcdadbe1476e391ce2fc9868540348b971c1ede8b56ee15d8',
  password_salt = '1Ei6s8XGgUm95TiQmynYUymg',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 96;

UPDATE usuarios
SET
  usuario = '74425282',
  password_hash = 'e80836d1cb20ea38affde646ba9ffe68df0e826aea19e037095d7703e7cb3126',
  password_salt = '0ZBSlt0J4LTciiIr25VxBEFV',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 97;

UPDATE usuarios
SET
  usuario = '44661327',
  password_hash = '83da129b47c92d2ad5d6bb873dacd20039976f58990eb0db3b1d8f876420311e',
  password_salt = 'C82HspwGAhCiBeaMfvJROxHJ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 98;

UPDATE usuarios
SET
  usuario = '42380704',
  password_hash = '9f29d134ce1a1ff8e3bcea53fb5352024f7ddbc76c21ba31c5137c68206c0ec8',
  password_salt = 'hPM6KqtdjvqZgjCwH1Px9NBs',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 99;

UPDATE usuarios
SET
  usuario = '80085228',
  password_hash = '04021cbdc64c33310e851b1a9dd1ac24eb6de90f6f99403c18f2c3c23bbf366c',
  password_salt = 'cr6iFMVa0AQ8nzP8tjdepro1',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 100;

UPDATE usuarios
SET
  usuario = '09654541',
  password_hash = '358225b11d73f3f9544563e6bdc1d1cb078a1e462af10a6ecd23901f3b0c0e5d',
  password_salt = '5YM32TlHGdRebu78nZBcoyC2',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 101;

UPDATE usuarios
SET
  usuario = '45564966',
  password_hash = 'd799faf94be523e66fc9fbcd93a7582b4cc90bde4e0c04f80b55b40f47cada68',
  password_salt = 'HOyBlA0QMeE2VTv4zSxv2Qrm',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 102;

UPDATE usuarios
SET
  usuario = '002882583',
  password_hash = 'a2b92c50399171d078116687778216d0d53b8b6b508c45fa2a25bf41fbb22714',
  password_salt = '1tyQSAGsfAh9uu1w0Ctczp63',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 103;

UPDATE usuarios
SET
  usuario = '42299331',
  password_hash = '4a93165d0fc0246a94b0b39b4492984ebe59b5b1bc4466aa77324697188b53a8',
  password_salt = 'olWG9m0MD3Ypm1P3tTaBOH0a',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 104;

UPDATE usuarios
SET
  usuario = '10738238',
  password_hash = 'a87736013852fc7b02465a24f894c01644a46dc53f4ca374cbd802fe8f8fb658',
  password_salt = 'xuc1I2hHbNAgSwWC80uD4g0j',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 105;

UPDATE usuarios
SET
  usuario = '09463795',
  password_hash = '5f50545747603fc8d3af93ebb63ad0e0b8543cf0a514c1bd6022d0a301229e43',
  password_salt = 'VDBwzBGAa1u0ifnBd40DVwjC',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 106;

UPDATE usuarios
SET
  usuario = '43198580',
  password_hash = 'c71a0060d4f05cc72a3f885ec44fed35a28dd1de3b6ac91a1452d625754e653f',
  password_salt = 'U7X2EeFCCEcBMI1WXWLbAUPu',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 107;

UPDATE usuarios
SET
  usuario = '06310557',
  password_hash = '929c8e46e6b4d3588dc8b7dc7561a534710f3351bf5a867696e9cee19d486e27',
  password_salt = 'OldLxYt674JE9tNlgauW3TAC',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 108;

UPDATE usuarios
SET
  usuario = '07512437',
  password_hash = '6cb51c70e4a676e94fb4a7315b9870d18d8ab093c99f56563987ed3a7636f073',
  password_salt = 'l554u29i4y5HyehUBzSFIxag',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 109;

UPDATE usuarios
SET
  usuario = '80651974',
  password_hash = '5cfbf3a86777d08acf6c07d2c90cedf73373aa9abfc43fd58e538405834bb189',
  password_salt = 'oGsW3a6fEUU4VgEZNacK5LAk',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 110;

UPDATE usuarios
SET
  usuario = '09698711',
  password_hash = 'f88482c9532d62770954ee30e1b213ef3013ee6c017f65539e88de7c987e1b23',
  password_salt = 'h4Bvhx6At4FFOHQNvX2IyzlD',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 111;

UPDATE usuarios
SET
  usuario = '47386069',
  password_hash = '8a734cc66b9dd90bf0e106ecdbafa27147b6e231d43286c7f68fc85e1a83d373',
  password_salt = 'BmRqaziYVm2IgN4hGj7bftAj',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 112;

UPDATE usuarios
SET
  usuario = '73106699',
  password_hash = 'dba562125a42e6be57b10146a170ac1ee71055a17fc2c9b405fc49bd2d495320',
  password_salt = 'lGeWdt7a6dP8b7mKKdpjMuyt',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 113;

UPDATE usuarios
SET
  usuario = '08926872',
  password_hash = 'd293ae758d5d02b03398a5ccecc72770fb213568f7468a4b87494efd588b74a6',
  password_salt = 'c2ThN8yTD950yzIsYdPcdxXH',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 114;

UPDATE usuarios
SET
  usuario = '10693701',
  password_hash = '3449075f7b10c69d06c61a8bec94ae722659f6ced7cd88f69473535089259034',
  password_salt = 'au6x3z5gfRMcnfm2rR7Y2IdA',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 115;

UPDATE usuarios
SET
  usuario = '47265741',
  password_hash = '6a9848ed14cb027f49942a157668148e483b1b40a61e986c83da3fed7c076fae',
  password_salt = 'lB4bkiReSxl0xhty3oEt9kVy',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 116;

UPDATE usuarios
SET
  usuario = '43583901',
  password_hash = '34d8058648481f9ddebc61a83d8f65848639417a96dc0ba1500364a5481a681a',
  password_salt = 'JK8OswzvuHkOOjTJ6Ss9AE2j',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 117;

UPDATE usuarios
SET
  usuario = '40526162',
  password_hash = '66856d7752917155078ed104c076dce7b770bcc272741dafff349c13c60bab28',
  password_salt = 'vdXy3J5BG5byUvOozLGHsdkQ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 118;

UPDATE usuarios
SET
  usuario = '43158157',
  password_hash = '6460682be72a842c815207fe4b4decaa8fa3bd18a526fb0da9c7f9442b02d6aa',
  password_salt = '4EQvvLACQiNPzYuYRt6xpFWC',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 119;

UPDATE usuarios
SET
  usuario = '46390978',
  password_hash = '0e0381a82fbfbeb313ac7a278c216fbecefeb0011904baf20d74f6caf7296200',
  password_salt = 'IVMHVIl6Lk8FP6TNuoMvg23d',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 120;

UPDATE usuarios
SET
  usuario = '48296394',
  password_hash = '9d41918817e0cd50ba54f3b1b9cbaa726ba0041195f33129991d5d4d07bc2cf2',
  password_salt = 'wJMVJXLOCAQEFMjC2rIQzTp2',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 121;

UPDATE usuarios
SET
  usuario = '44755623',
  password_hash = '819cabe08419728fdce6c950545a4cdda4c212679866ee774ffafc755c4fd0f2',
  password_salt = 'XIM6MSkgGobcLF7yJ3FqNra7',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 122;

UPDATE usuarios
SET
  usuario = '40663408',
  password_hash = '4745b75fe895100dd6d9f5e96d7231ede441c51831903ef84cab719e937a4ba9',
  password_salt = 'CtS4YuNIg65qtgE4TphBDGtS',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 123;

UPDATE usuarios
SET
  usuario = '25843251',
  password_hash = '3527cda048b042906c575054d20a45dbdafcf481449f6d09dab1a51facc1e7f5',
  password_salt = '9GQvHXjHp3BIqUbEeTtAndRr',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 124;

UPDATE usuarios
SET
  usuario = '10601223',
  password_hash = '5441ab2c16ebe83548b2e17249a5236e23651eafc5b6c2ed26f8a0e988719149',
  password_salt = 'wvnQcoU89uvqpONeJhFliStc',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 125;

UPDATE usuarios
SET
  usuario = '07644184',
  password_hash = 'fdfb8c43f119482edde5cb109b40b8a3d382eda11411e748f1457d7f75fedaee',
  password_salt = 'tw9SZxavslu2WWzOlS0NEhmO',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 126;

UPDATE usuarios
SET
  usuario = '74490230',
  password_hash = '8f240b2eaebbaef8a2d14f7d83fa46b97a9e87ff6b9acd89fae3ab54bb1010fd',
  password_salt = 'oPM8STQ50fl9sNWiZGBCGo1n',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 127;

UPDATE usuarios
SET
  usuario = '40881456',
  password_hash = 'ba7aa502df9c4de11c39a3e0be89b42d89e18528775224f8dadc251cb5fe9e58',
  password_salt = 'wjoz2bJWSlQrc4Qbo79DNY5h',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 128;

UPDATE usuarios
SET
  usuario = '003611672',
  password_hash = '3f18a474c6772e7cc60afa96d15a4bde34e3138581e85b0ca591f7448ca19f69',
  password_salt = 'T9b5w5dQxXaptrmCfXVbA3XW',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 129;

UPDATE usuarios
SET
  usuario = '40324343',
  password_hash = 'e2c25dbe7bfc1eacdd4640bda766f3a7deb40fc933f8d531b79bbcf22b87e077',
  password_salt = 'kenNFWmZjcZSjVxtjwn5Ao33',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 130;

UPDATE usuarios
SET
  usuario = '09797670',
  password_hash = '2d1d02ab215040ed19ce5e8351a80f5d3d6b229468d24cb837ff89698287224d',
  password_salt = 'wahh6KdGkeVP1HCQXUdvQBWO',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 131;

UPDATE usuarios
SET
  usuario = '73049385',
  password_hash = '9c854c644afa7dd8b394facba9bfdd18199d3bc22bb693d1b39df29847caf3f4',
  password_salt = 'rLyBecEQzQ7q2YlwbRLTpWQE',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 132;

UPDATE usuarios
SET
  usuario = '09310601',
  password_hash = '6dd0226e8c7480d86ad3ca9faa603fdce8011881acdb319e82a36da00a8e8725',
  password_salt = 'IXe5JF9PNUVXKXSa2guRsO1E',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 133;

UPDATE usuarios
SET
  usuario = '71134697',
  password_hash = '4a683dd1edc52187badfd5a4bd3c871d393cb2d904f391e45f242fe311d1788c',
  password_salt = 'xc3KdEdCupSGMa5CSaSwI0RG',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 134;

UPDATE usuarios
SET
  usuario = '45088309',
  password_hash = '934893b0972461655621c2521539bda774c72099e98b0e8e797ba46b151d95d6',
  password_salt = 'cv4r0yp9fo4Mk1tpgdjoA1E6',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 135;

UPDATE usuarios
SET
  usuario = '73823595',
  password_hash = '1b0cd38cbbfc8f4efb192dfe77b392f13cce789ca85e61b9e4d8e3508f0e8531',
  password_salt = 'goHUXo8GiolsQooflhlbTxXs',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 136;

UPDATE usuarios
SET
  usuario = '09443455',
  password_hash = '5140bea079ccce7333a9d05636bf3da6b1fb0c1be75e18234d35bf76696855c5',
  password_salt = 'Hw0iZwDT9XaAyZkdLIDxfh1f',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 137;

UPDATE usuarios
SET
  usuario = '44724164',
  password_hash = 'dfd7e2f4a61334e88867593ce75c0f0fca2af0088a50976b9def47d98d7baa97',
  password_salt = 'DufVfCePGUCAB7nQ4E1CzQGo',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 138;

UPDATE usuarios
SET
  usuario = '43062111',
  password_hash = '7e15f937586136f98e3fba1274aa7315dcab649c0ec6e5cdb3bc5f1c61f15b35',
  password_salt = 'F8e525e9uS3LL60fXLThC1kR',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 139;

UPDATE usuarios
SET
  usuario = '42613475',
  password_hash = '347e47c37a60fd37af40edb0a757aec569bb3bd991b5ab3521f424addbb87832',
  password_salt = 'BqoRVd88QHvkaVRCR1IWim3E',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 140;

UPDATE usuarios
SET
  usuario = '42793026',
  password_hash = '9fa505a553c24577865a6bf6dcb61ff922cc3b6f9de1bcf1b1bb2db7391511f8',
  password_salt = 'GvyjVOutUy5okqf0EJ1hOfca',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 141;

UPDATE usuarios
SET
  usuario = '72491985',
  password_hash = '4b7cfa2a09f54d2a2d46af76c29c4204918c71050130a99e7d787849d7ddf6cc',
  password_salt = 'YeWfy07nGLEu9bF22zH72Mkt',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 142;

UPDATE usuarios
SET
  usuario = '43639831',
  password_hash = 'c96665c0ad52a57a46dbf6fff64a39d6faa852e989f9f974b845062f9131dbe5',
  password_salt = 'NLAm2ZSveS2Lcwjq7SryxoUz',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 143;

UPDATE usuarios
SET
  usuario = '47961510',
  password_hash = 'c5bc7cac03c3eb093073acaf2aa3090a7f7995b2437e085afbae3611a259bedb',
  password_salt = 'VOx6D3PkiKcuHG2R8a0nq2tj',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 144;

UPDATE usuarios
SET
  usuario = '46427144',
  password_hash = '159bb3b92f11e4ae4430a045024b9012b047345817ef94230c6fb78c4a4fb3cd',
  password_salt = 'CDYLiEZlSZPPyTUWeeIiRCY7',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 145;

UPDATE usuarios
SET
  usuario = '40542828',
  password_hash = 'b9aaff1d52dc748dd00bc7e2f43a53d47d0f66c74b09b28f448fff2ab1e4acf5',
  password_salt = '5yQMqvBzyBR0eT1Bx1MM2KH2',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 146;

UPDATE usuarios
SET
  usuario = '76156532',
  password_hash = '6047d6712c9d5754eb670d7476a0ed82cc7d2fb941f5187489823cf08bf99625',
  password_salt = '3aS0WIh6wV36KPNuonESMdpn',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 147;

UPDATE usuarios
SET
  usuario = '44744403',
  password_hash = 'd88b181ebfb161f5312c9af4470908055ea35e76321349fe31a7f7cd3f7a047d',
  password_salt = 'nAOPtKE5FLLxAKfIsZ2Rbr0F',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 148;

UPDATE usuarios
SET
  usuario = '44608232',
  password_hash = '07e7449c81b168d3e383c01774eba719176214c075508fe5e36143a5905a3d50',
  password_salt = 'TT3CXG6m1rchinbwv4lj8WYE',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 149;

UPDATE usuarios
SET
  usuario = '73193169',
  password_hash = 'a2d136763164bf5e492ea652ce609bc6f5d2d4d612afd169cd6011f901fc91fd',
  password_salt = 'jEpyAuAJ29vLyHQwdPmIvKKc',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 150;

UPDATE usuarios
SET
  usuario = '41193794',
  password_hash = '51c1081428069a7ffbb4b1c4ece369d59d1df7c64e7a15d0981fb7cba298fafd',
  password_salt = 'uIk5yAfMvVfG4L1wEFT9KFCl',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 151;

UPDATE usuarios
SET
  usuario = '43347896',
  password_hash = '7de99b2a9fefd0bbefa10ede1ea71d9e6ede1ed9278fab4659ad35a406bd1a48',
  password_salt = 'k03U8nRkuf1otAuQdoEhcXYV',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 152;

UPDATE usuarios
SET
  usuario = '73883342',
  password_hash = 'e7d7b9a80279020ad8f02a0560a60a663b3cf125d43d182661649a3d1b00bd5e',
  password_salt = 'NHxReGuhfgFTxQ7hStwZUDnV',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 153;

UPDATE usuarios
SET
  usuario = '47231718',
  password_hash = '5dc0091c2abf10cfa659559dc74e4de8cbf22e6ee2f2e7d3c0780b12df257331',
  password_salt = 'oEBhWLAuGahQdENSwCMv4sAs',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 154;

UPDATE usuarios
SET
  usuario = '45843628',
  password_hash = 'aa45db79eac38d2b1dc2b1c5ced930216f0e69a5ff04b024632f203cf8c52e14',
  password_salt = 'xoqonnLHrhO4D54By8JgV7Ix',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 155;

UPDATE usuarios
SET
  usuario = '74215267',
  password_hash = 'c0d3a9083f24350dc2f26c9d4acfc12f5314f79a4c5a7e399ecc94020c229db4',
  password_salt = 'Qn5Jk3g72kCtZRGzJXvVVkWr',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 156;

UPDATE usuarios
SET
  usuario = '41218850',
  password_hash = '7c318bc2ddc2f38ef19cbb059630c2284489c085e89b90a486fe0b38f466aba8',
  password_salt = 'ELy7r9WWkAPz7E3u7qPwGhPN',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 157;

UPDATE usuarios
SET
  usuario = '70265929',
  password_hash = '7cfc4e1f19f034a4b00dfd79504ac8336db7c60462ce1edb823a5d7f20d8c16b',
  password_salt = '5Ob44nzRth2IZlKq787Usx7c',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 158;

UPDATE usuarios
SET
  usuario = '75243488',
  password_hash = 'c2cf81e8b397704b0f59490a8c79f58adaa882d8db23c713161959cd8109acce',
  password_salt = 'LGzM6SFWyngB6FjPjSkDgOMg',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 159;

UPDATE usuarios
SET
  usuario = '43488726',
  password_hash = 'bd265810462a17e21258eebce861ac7ea1838e1fc511896b0a78bc89f0268521',
  password_salt = 'HWkjE2eUmnid6lJZTZR0FqTD',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 160;

UPDATE usuarios
SET
  usuario = '08006792',
  password_hash = 'f4c44a52456fa849fa6e1b3e2a87cbbabefaddf43ebd40d4839a1bfda0058ba5',
  password_salt = 'qw9tBF02dy8OSUg0jFuo7lEe',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 161;

UPDATE usuarios
SET
  usuario = '41157715',
  password_hash = '7c1f819291bc2b0d880ab4e59e61f0b62e519fb0f5f3c2a7809a983a86a03bca',
  password_salt = 'oi01yXeV5P35gNR2QeGZk3GL',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 162;

UPDATE usuarios
SET
  usuario = '43069784',
  password_hash = '671c0501388f0a1f4522fbbd9c359f7096f59163479ef0c401b0d50ece6f6c3b',
  password_salt = 'fipqfRH0yQc0HldAE7yHcCPX',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 163;

UPDATE usuarios
SET
  usuario = '75132334',
  password_hash = 'afbe833ec618611af5e97caf887e1eb9be2adb68df7b334026b5e6d46b916b53',
  password_salt = 'R3HTRc9PDH8PN1xgdXyxgkGS',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 164;

UPDATE usuarios
SET
  usuario = '44003631',
  password_hash = '6609e27164a2ca10e3f26359a23f431cab73475e4967c8d2304d6b066e84f83b',
  password_salt = 'EehcPr960KYKhGjz3TSyi8Dy',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 165;

UPDATE usuarios
SET
  usuario = '23885044',
  password_hash = '11e590465a7bb4dae7171d48d42147f7f0f4c4e531ededb55ab1b2b6c326aedd',
  password_salt = '1rOx0IjPFoOffwOR78yYMG48',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 166;

UPDATE usuarios
SET
  usuario = '73254302',
  password_hash = '6d612d2a96c8034dd67b0b638fd1146a412685295b10d317089990f1558d5331',
  password_salt = 'YKUj7o827ukpbqNzBjDELuOm',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 167;

UPDATE usuarios
SET
  usuario = '42190577',
  password_hash = '1451abf3423e34fbd11537497b0a0e791a04763f171fc8bd84fd701de7ad78bd',
  password_salt = 'UR0rEN4lrADFEAXkuF1gB0mH',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 168;

UPDATE usuarios
SET
  usuario = '44001139',
  password_hash = '9975f0127e13521203eb1a473f68dc82c10fdbde3396fba03e8ddb036e172120',
  password_salt = 'oUTO8lx7qQtDIx8G8eTvwSlH',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 169;

UPDATE usuarios
SET
  usuario = '43982220',
  password_hash = 'dc8bbcaaea189f30f1c74a78154a3dd469e41adb11eeb87a4e76e1ac32d54515',
  password_salt = 'QQ6jvTF9TJUKP8YemKuGtQcG',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 170;

UPDATE usuarios
SET
  usuario = '43521667',
  password_hash = '849105753cab9433feed41c034210577141dcb0cad15c9f165a3f4eb2a5f502e',
  password_salt = 'EyK7hmq3xc10d2snHpU3G24M',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 171;

UPDATE usuarios
SET
  usuario = '44674254',
  password_hash = '7607c0efa19dad82a7cc449616ba6f326c0d7660bc3fc45019d5735537f8c4fc',
  password_salt = 'RKx7fRahjOU4rL59Tk6Efhh2',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 172;

UPDATE usuarios
SET
  usuario = '45902434',
  password_hash = 'f842da0b306e6e6ebb7459636120d468744272c82e75f196ca878e7144aff48c',
  password_salt = 'FsDFAkFZKk7JxZtRseKvPXbG',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 173;

UPDATE usuarios
SET
  usuario = '40760445',
  password_hash = 'f5f90ae1e02cd209c58aa870ae3e82972501777639c03a5d2caeefbab1c0da8f',
  password_salt = 'j9k0fmUrqbiBqS262d4S2lXM',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 174;

UPDATE usuarios
SET
  usuario = '41188862',
  password_hash = 'dfbed6c9813d33aab41bc56cf3c195db7af2df8f6589cd44a8e988e05a5be99c',
  password_salt = 'p5z6asJl1dxt1cBhZMfQnT3Q',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 175;

UPDATE usuarios
SET
  usuario = '44854491',
  password_hash = '9347de25ae07454660fca9a31a89380266cbf06964f4e837cabbd127d9ea0352',
  password_salt = '8EcnN8tGVzOqujyQovhExFo6',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 176;

UPDATE usuarios
SET
  usuario = '10405527',
  password_hash = '358567b7cfbe38ff968649a1069f5fff2d57e61484aa594f9193f6a7500843c2',
  password_salt = 'GKYfIgClrlj3fiYx6FnybAcX',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 177;

UPDATE usuarios
SET
  usuario = '43911879',
  password_hash = '8ba9d90f38581a6643cac769007ae73ca7751645e6961b20984726edb025ab5d',
  password_salt = 'ub6A5e4vWSB028gl1gejE8kq',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 178;

UPDATE usuarios
SET
  usuario = '74900126',
  password_hash = '59767f804cd9ae65e02c6806795bac3f7d538060b444bb4ec460e20367140cc6',
  password_salt = '3Dzfko1aJ52NvpOTtXZv8mUt',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 179;

UPDATE usuarios
SET
  usuario = '45782436',
  password_hash = 'e89d182549dd009dfbc646fca38b3192c7823bf1367dd1e1de7c2dd63f2fe0da',
  password_salt = 'vCyhv3vbc8LPOjGrygfh8j5H',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 180;

UPDATE usuarios
SET
  usuario = '70122837',
  password_hash = '9da537648e2b1b3eff65c2cd6224849a748f11f1347fc44535b997d9dd0c8a8a',
  password_salt = 'dtJQU2w3npDg6COsJ1vHZ0bK',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 181;

UPDATE usuarios
SET
  usuario = '004563447',
  password_hash = 'f62e0096c3900ab32fe0d1588ba3a13abf8c5145a988b31ac680114046a68c0f',
  password_salt = 'xQJUiz6r28LtoEZyj2agKJk2',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 182;

UPDATE usuarios
SET
  usuario = '002736513',
  password_hash = 'c10d6892ce493e86f163670638175b55ba685acb3d5315d34571bf3868865451',
  password_salt = 'Ih6BLl2ov7IjzB2a25tzunx7',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 183;

UPDATE usuarios
SET
  usuario = '06779487',
  password_hash = 'e3530846bed86d6e08994849d949426cf712b3171299630a5d208df24592ae18',
  password_salt = 'Ved9Jv5RZzsYCaBv0RxcctQM',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 184;

UPDATE usuarios
SET
  usuario = '74152208',
  password_hash = 'b7861f27f112d611ba2a6084d09500264173f0c49d414c7e1f0ef8d0fcdef8ca',
  password_salt = '6a4WBjo57TdB8Y1Mo5cee6PV',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 185;

UPDATE usuarios
SET
  usuario = '47531401',
  password_hash = '1fca25cbbbc86598808c61dba92ad6d5e3987a86a1015c17ae11e2c009e8f28d',
  password_salt = '3AyuCE4yc43KqzPMqkhK6qNF',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 186;

UPDATE usuarios
SET
  usuario = '73592896',
  password_hash = 'aefe29fa4f3b742c93e57914fbb19f9e95ca1b9c4855b393ed957fd15b4bb418',
  password_salt = '2IDLMqCtMI2eKQwXAXpN7ROy',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 187;

UPDATE usuarios
SET
  usuario = '75225792',
  password_hash = 'ce6fb3092edf1629b584fe1e09ae5ddb814678c3e440ca7767879603667000b2',
  password_salt = 'jsiILVt7smpfQaZxMxBvL3uo',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 188;

UPDATE usuarios
SET
  usuario = '72789623',
  password_hash = 'd217aa4f85b1cb949da0cac377fc9b7643c324c52ddaaf001eff6711f7f79b51',
  password_salt = 'IdbXWWUvrfsxzxMi7053ZNan',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 189;

UPDATE usuarios
SET
  usuario = '46736823',
  password_hash = '21e1c07bd719317e8c91174744e3519b6b0f8c51d7f46aa9a107b9dca67618eb',
  password_salt = 'qFKvzxEy6RtZbw0TeogDlRUZ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 190;

UPDATE usuarios
SET
  usuario = '41198408',
  password_hash = '596d1bc07348261d23cb7979723207206a1b7285b057849992e792fbe52644d3',
  password_salt = '2XKc03X3MgFPnFLXku7tAQm4',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 191;

UPDATE usuarios
SET
  usuario = '71298279',
  password_hash = 'e261c34f475e381ac1c8c634bc6b18502ffa61cf11978ea13744f9236236be9e',
  password_salt = 'ycdUK806jv8zL24GtzM8YtZs',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 192;

UPDATE usuarios
SET
  usuario = '71285476',
  password_hash = '8c261ab06c6c2dc5665e2a2ebbc59b216bf50ea8ec4d910f6bc387cf6c81a2cd',
  password_salt = 'mdLlXXef5xADCzVz78byJ8W5',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 193;

UPDATE usuarios
SET
  usuario = '44447795',
  password_hash = '4903c63033e682d1361e2c52b7838e52739e2b5cb671a8468d0cae8939bbd854',
  password_salt = 'fGZcr4Vio9InQX23aqOmkoUd',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 194;

UPDATE usuarios
SET
  usuario = '46239009',
  password_hash = '9adcd0574ddf3275894fafbd988ae0fc011e99a89d1d7e9d8da8f537ef92aad7',
  password_salt = '9TwaMTtUMNKK7UE8rtV1Gdmi',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 195;

UPDATE usuarios
SET
  usuario = '48305082',
  password_hash = 'd9bf8ea437cd89c70dc4a795fdea5c7a268e0cb04af300ac73f09c6149b95cf4',
  password_salt = 'LZOiNiPHySoHCg5DfQQ6fwtZ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 196;

UPDATE usuarios
SET
  usuario = '007310421',
  password_hash = '105d7132f1937b442fbe8ef5e273e0df7ba8bca0e39605d1fb4117788f26926d',
  password_salt = 'f5vvfXLG3BOC5Tzi1SGbstQH',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 197;

UPDATE usuarios
SET
  usuario = '47957470',
  password_hash = '2d9118f764f114c781d261ba18fab936ef571916848bf61c5a8c19256f684e44',
  password_salt = 'jEfeCkyjyIVoNaSeepMa5n3E',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 198;

UPDATE usuarios
SET
  usuario = '47922600',
  password_hash = '7a4b833ff916de32c63fbc01281349b13ffb281507f8c83cc515adce195f32ea',
  password_salt = 'JTx0gJuqVo5lp1mcfxAC4vZg',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 199;

UPDATE usuarios
SET
  usuario = '76473092',
  password_hash = '64b276474e845727b0d3613c98fac0cdbfa9237e7b83c0a103b3df41639dc6e6',
  password_salt = 'xkec5D0bnREkf0FtigWrcTV8',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 200;

UPDATE usuarios
SET
  usuario = '09587002',
  password_hash = 'b19332a98ded08be091e9782ea723a277c95f49d27bf6f3095c33447cc2b862a',
  password_salt = 'hQ3d2iVbWQ699Qy0XwlGU2MS',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 201;

UPDATE usuarios
SET
  usuario = '07178045',
  password_hash = '0658c0930c4d8f46c7045b61bb1184cf31868d75bf62270c42b0c426097a61f5',
  password_salt = 'RxZdOMl2WxmS02oaEVD9BDFg',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 202;

UPDATE usuarios
SET
  usuario = '42596065',
  password_hash = '77de91a533a9191d37e7abd1e1e1f4a252024fae5d17798b92a564a97020c047',
  password_salt = '3YZwRhKJh3vokRyiRimytA8E',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 203;

UPDATE usuarios
SET
  usuario = '74599054',
  password_hash = 'e1d48c9d21986350a1ae3106a108efcd7c1b820a87be5b37fc1417c907b294b5',
  password_salt = 'EZUJYcLR2lxWHX5xT1jKW0su',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 204;

UPDATE usuarios
SET
  usuario = '71444758',
  password_hash = 'dc369021385f65345b233372c7d2224e3663dd6f79bb2c63fe047dfbf3a66100',
  password_salt = 'wXojy5ns8DLYv5Mz0eyqLdyJ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 205;

UPDATE usuarios
SET
  usuario = '03888195',
  password_hash = 'fb94b5896f9006aec936ba1f3955aa16b94241d7c0151bc77af4a4607d4895ee',
  password_salt = 'zrbUg5EVCLN0rvzS8oHuxfrG',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 206;

UPDATE usuarios
SET
  usuario = '46347799',
  password_hash = 'd5ab7b112c32bb78e85005b4d6e28c3b28269be1b0bb2e4b62d42a6d06666a6d',
  password_salt = 'O0BTGObM04lBtDksSlJbAlVx',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 207;

UPDATE usuarios
SET
  usuario = '48039926',
  password_hash = '99fd5a213d35a9ab84b377fb8102a2b2255824418f2c48c7df267db303993989',
  password_salt = 'kwqoGtelPkFx0ysk5aTgw6JV',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 208;

UPDATE usuarios
SET
  usuario = '45201756',
  password_hash = '30ace883576b371fa952ad2e29635152d720995e38514f32e51cf22faf82c536',
  password_salt = '79Rf0yNW51hYePYyLM0BeV38',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 209;

UPDATE usuarios
SET
  usuario = '07687828',
  password_hash = '184a5cbc6087f3e8f08f33064759283baffa5514be499f86f6820b5d6e9b4290',
  password_salt = 'aNwunYcBbtgAfAnxu1JC9N5u',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 210;

UPDATE usuarios
SET
  usuario = '07020528',
  password_hash = 'bbac4cfe6e445ada9d0b8e38cfaaea42e2bb04f6081252b46d8961230bcdfa6a',
  password_salt = 'J0tvougBjWZLZApZvyhic8kI',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 211;

UPDATE usuarios
SET
  usuario = '41159259',
  password_hash = 'a97f9daa69f741740e75499bcb4745fd54cedbb244bfa49b23cf008ccff02dd3',
  password_salt = 'lQ9486kFjcku2zkqZ4YodxBk',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 212;

UPDATE usuarios
SET
  usuario = '40337082',
  password_hash = '52db1ae94ac23992d04f25f3739e878b69d6b767a7fa8a0fa32d74f6e5fd6520',
  password_salt = 'uRoA2kjbP3eI0wOyWus7kn9b',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 213;

UPDATE usuarios
SET
  usuario = '10637060',
  password_hash = '45686493fe63563c3f7a7da867303562e99f1d084002789a9abf3393f846b656',
  password_salt = '2AktIN8EJlnh2EiNqTahYfqa',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 214;

UPDATE usuarios
SET
  usuario = '41912460',
  password_hash = '9cf42e0a1f4c6a47fa833e29e8b32ac987820f5fdbca2f375683952a478d7a58',
  password_salt = 'C6t3ThQc1zSbVWsGAqJdlfZB',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 215;

UPDATE usuarios
SET
  usuario = '07486917',
  password_hash = '1acafdfcc01ca5dcf8d555cb4687fdc854b51a739cdaccdda7ca39e266344838',
  password_salt = 'JeVnRrcGgfmFp7kwIWBgUcdH',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 216;

UPDATE usuarios
SET
  usuario = '77172836',
  password_hash = '49f158244330cbad146dbc2467189028c0018f6174a0e4c692298d63bbf344a4',
  password_salt = 'jx5e4LOrN3A1NMzu7vr2OBbb',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 217;

UPDATE usuarios
SET
  usuario = '21828964',
  password_hash = 'f751eacd1d2d12b9df25d1a3d663cdc7f9695de242a7aefed75d6159d8756817',
  password_salt = 'dtZEoiVht10g6ssMzTJ5Cp70',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 218;

UPDATE usuarios
SET
  usuario = '74926893',
  password_hash = 'd4d65e7237cf164cbd3e4b8b5ab587d9a09e5b92333ac90ff403b920ed648342',
  password_salt = 'kg1X4buexuy00iaVRjJ6qKvy',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 219;

UPDATE usuarios
SET
  usuario = '70229621',
  password_hash = '3f9a91532dff43e7257d8af04fd75d472855cabc2d63a89cecf041ad19c00f29',
  password_salt = 'Cqd7xtZ2WGT4zXHuJznhplyO',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 220;

UPDATE usuarios
SET
  usuario = '08144103',
  password_hash = 'e604e1613f1747d99ab416a74e6dbc2be2b3a07a33c5a26c7be18e0aa4dd9a02',
  password_salt = 'oggzGKUKQb7cmvngb1wzUqsQ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 221;

UPDATE usuarios
SET
  usuario = '70804241',
  password_hash = 'e9b3679bdd04aa82d7223413ac73e4f647517815c9a1b5cd42b969ab9bae45ed',
  password_salt = 'rIGHleLFgwbhznNNMiF8cCym',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 222;

UPDATE usuarios
SET
  usuario = '00508045',
  password_hash = '345c96178e2075e619df66808974dab067c3e5cc0787380ba38d5105460dcd60',
  password_salt = 'hbN8Jh3CbG0q812vQdCs1n3g',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 223;

UPDATE usuarios
SET
  usuario = '07107185',
  password_hash = '8451c33e2f13d3ed7491cea5914ae622e633bdf11e2e6a49f07fe62603e3f630',
  password_salt = 'z0z8L22fNkaAPpIm1M1rITQf',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 224;

UPDATE usuarios
SET
  usuario = '40553780',
  password_hash = '61c677b7743deb12ff11b604a6441ad4b7d1352a08c8acabff95b8d29b9e5014',
  password_salt = 'bGYUR9i48JoUX5clFRXauixN',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 225;

UPDATE usuarios
SET
  usuario = '08156947',
  password_hash = 'f57f661dccca71eacde9b2b738bc808c486deb50c2d155ac672b31dc1e987e8a',
  password_salt = 'AAY7NNKNF3OQtwEOhvKMpnvL',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 226;

UPDATE usuarios
SET
  usuario = '44164396',
  password_hash = '20d2f9bac0d14892ce544f9a4cf2fc9f480ff684176aa2021eec433dd5edcd86',
  password_salt = 'fdL87sEhLk8JGXG4ZtzOcoRc',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 227;

UPDATE usuarios
SET
  usuario = '70512352',
  password_hash = 'cb6ce82a94625cb4e10c0c0a6a21d10d5b1b7d5abb5e379637f8e71688a88312',
  password_salt = 'dSVXilPz79g0XiuQGpKVad4D',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 228;

UPDATE usuarios
SET
  usuario = '62553875',
  password_hash = '37a2965e4350a3d9892aaada51fba9d20cde63519a6863efdaa81169a63eff93',
  password_salt = 'poeCCVfM2PACqq0DcbYoUCIj',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 229;

UPDATE usuarios
SET
  usuario = '72822916',
  password_hash = '9d2755788127ff72be66bc93ec65374ea0819d0a49ed10ec9625d205c99122b5',
  password_salt = 'DgqryNDww5mwWuZVPoto9NML',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 230;

UPDATE usuarios
SET
  usuario = '73216819',
  password_hash = '971a47a6acf9d263dbe6c6be64a846ac57f542e66024adceafa50de06b47e8ab',
  password_salt = 'BQA5LuZHtMlaTlmjmd2TcQvU',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 231;

UPDATE usuarios
SET
  usuario = '75309743',
  password_hash = '76dd30c0e268f66b2751ebbf28d0efe963655a1632a5e6ac71bf683681663c93',
  password_salt = 'y7Rsnlo83WGYH24c2DKXQjOs',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 232;

UPDATE usuarios
SET
  usuario = '73858027',
  password_hash = '9526448a8a39b24a652aa7229c5c2371a6770dd91f950180850df45ad451bdc4',
  password_salt = '5ehjJGCbgQGsnaxjTpKirzmY',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 233;

UPDATE usuarios
SET
  usuario = '71034444',
  password_hash = '2a6851d8b8fbac42c63872b18010396cdd5122521496122b1e62c94c86aca271',
  password_salt = 'jp5vUHJ8X5RxFmY8aPSPreov',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 234;

UPDATE usuarios
SET
  usuario = '73621619',
  password_hash = '56b9b92f64480bf8639cbd98d57c155bdcb166ee6e5a288e983b7ab529970159',
  password_salt = 'MzoMXR0w8YgYdw30dCHEDimv',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 235;

UPDATE usuarios
SET
  usuario = '73221868',
  password_hash = '43582e611ba6a210aef0878f9743f2346350e7cbaa87b7830d34c508dbd156ec',
  password_salt = 'B8x0JzMmUOj2hkhIQsHyfeKB',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 236;

UPDATE usuarios
SET
  usuario = '42523903',
  password_hash = '49e62860b51fbfb5530542279dbd57df5feb90cb680f02d892a1e25a2404a61b',
  password_salt = 'kG9RKJ6ecjeMefPTVvWgquXN',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 237;

UPDATE usuarios
SET
  usuario = '61968180',
  password_hash = 'fef7568c6e6e400de0b49e5def178529941ef0a78fd4e6692fcfa07b0b6a6dcf',
  password_salt = 'aS2AIKWJqycmnipb02GeSI1Y',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 238;

UPDATE usuarios
SET
  usuario = '44921324',
  password_hash = '601118c0b4f9a106e079ba318b41ed651a0a20e6516fe0eab18c64fbc32be5c9',
  password_salt = 'PrnSppF0GJzXxPPNCXazwbgL',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 239;

UPDATE usuarios
SET
  usuario = '72414612',
  password_hash = '382b1a46053ddc7b719d536ea37589fc12c0f96a7a99ef85933f24fb8fe5eca9',
  password_salt = 'Uz7xFfpQScHiH9PuNiHykTHW',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 240;

UPDATE usuarios
SET
  usuario = '48101287',
  password_hash = '3af98bd583ef186cef10d509af28aa68a62298dfd75fadcb336ed25c6c1979fe',
  password_salt = 'gxBprT3fUU5Tu4BiXESfWEHt',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 241;

UPDATE usuarios
SET
  usuario = '44498574',
  password_hash = '1111da2fc29e2a63b9c73dbeb61d261a4fc450a4aa4c33258330e5eaac8d2031',
  password_salt = 'faQeWg7f4rrlKX9cq2eNpej1',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 242;

UPDATE usuarios
SET
  usuario = '07530013',
  password_hash = 'c20bb0eaaf2c209d6a84b5e963956c6e31fed4485e70261146aab951436647e8',
  password_salt = 'UtJ6hARM6Fd6HYYmOUknH29r',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 243;

UPDATE usuarios
SET
  usuario = '43668051',
  password_hash = '966ff576fbed73ebb5b4eae43aeed6078a295d72f725953b84cbf58a7a2b1fcc',
  password_salt = 'b3NKDnWTTiUHT2qCaT7lMgEr',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 244;

UPDATE usuarios
SET
  usuario = '42109694',
  password_hash = '56032bcfa34473d74a5e4a67a03f4ba4747c7f8af8168ca5e8b6b84d034fab07',
  password_salt = 'V5jfyiKWTGQYEKh5JiIiM3jN',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 245;

UPDATE usuarios
SET
  usuario = '73959149',
  password_hash = 'be5ceaf6659ef2e7ef6e7c63327c82f1a09d1bef087ce244385ba2149b3752bf',
  password_salt = 'x9G0ehHa358PnKvUiEApLaYf',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 246;

UPDATE usuarios
SET
  usuario = '43411201',
  password_hash = '8d178322f82748bcc95e2e9f0d56a22d05bfd9c6e175925616bbbc15d0cb91d3',
  password_salt = '99ENJvFjlIKvzdvazUxsuk9S',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 247;

UPDATE usuarios
SET
  usuario = '008487905',
  password_hash = '94659e1848f4ef103b7c722a63fbe8defb19741ef525e095b7e32de546a3abe8',
  password_salt = 'pdexzX4JVSCO1Mi4RL0ie78Q',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 248;

UPDATE usuarios
SET
  usuario = '43564346',
  password_hash = 'dcb5d7a372f56a549d80b3d0ebc8cebbeacb5d03acc9be6da4fbbf4239f7f58b',
  password_salt = '9lzYrfcDxy5BnR1iyQ6zKaXD',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 249;

UPDATE usuarios
SET
  usuario = '77679589',
  password_hash = '776139f251bb93fb8385f1b68736ab565d09a84fbf23c1c50f295639473c1eee',
  password_salt = 'gHSH9aBZya9yzn8i5k4l53LO',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 250;

UPDATE usuarios
SET
  usuario = '06771564',
  password_hash = 'fa816cba35b7e40b5a7732a67bd3e6cc0cd3d693de89f2cd82167e8099c082fe',
  password_salt = 'i9K5QRII0aZ9bn8r0VpvFTMw',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 251;

UPDATE usuarios
SET
  usuario = '07036055',
  password_hash = 'da96ff49ead3b223772a92fd5b51f147e2385dfb9258b1808c5e0819f6438492',
  password_salt = 'BhzmPMsrQyIYwjkKCC4wtBqZ',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 252;

UPDATE usuarios
SET
  usuario = '09833401',
  password_hash = '5497a6e6a9532f22c7216712a0d0bf47e33e99b0deb0837408ea6b27eb42b39e',
  password_salt = 'q0uEZpbJ23TueXaLuHXJ9VXg',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 253;

UPDATE usuarios
SET
  usuario = '41888437',
  password_hash = '8507497a52244c484fd44dac244aa6f694512b8ce81b356f6acb4eb0a3d14ca3',
  password_salt = '4pQ7AzeZAx5K2ZP9Glz7gD1Q',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 254;

UPDATE usuarios
SET
  usuario = '40012551',
  password_hash = '317869dc1dc1b4ba06ca497234fdc38cbcff7674870a0985fee42e1fd6350b56',
  password_salt = 'knNBFmgbvklqHhmsnUxzGxhs',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = 255;

