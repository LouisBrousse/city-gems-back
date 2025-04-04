# 🔐 Documentation des modes VULNERABLE et SECURE

Les deux modes ont été implémentés dans deux branches dédiées: vulnerable et secure

## 5 points de vulnérabilité ainsi que leur solutions sécurisées ont été implémanté dans les branche respective:

### 1️⃣ Broken Access Control  

🚨 **Vulnerable:** 
Pas de vérification d'authentification pour les routes
✅ **Secure:**
Implémentation de la fonction authenticateUser qui permet de vérifier le token de l'utilisateur. Cette fonction est ajoutée en paramètre des routes concernées. Si l'utilisateur n'est pas authentifié, la route n'est pas accessible. 

---

### 2️⃣ Cryptographic Failures  

🚨 **Vulnerable:**
Mots de passe stockés en clair dans la base de données.  
✅ **Secure:**
Mots de passe hashés à l'aide de la librairie `bcrypt`.  

---

### 3️⃣ SQL Injections  

🚨 **Vulnerable:**
Requête SQL brute qui permet une injection SQL dans le login. 
Placer ' OR '1'='1' -- dans l'input email du login permet donc de se connecter sans credentials valides
✅ **Secure:**
L'utilisation d'un ORM (prisma) permet de sécuriser les interactions avec la base de données en évitant les injections SQL grâce à l'utilisation de requêtes préparées et de paramètres bindés, ce qui empêche l'exécution de code malveillant injecté par un utilisateur.

---

### 4️⃣ Security Misconfigurations  

🚨 **Vulnerable:**
Autoriser toutes les origines dans la configuration CORS.
✅ **Secure:**
Autoriser uniquement l'origine spécifique (localhost:3000 dans ce cas) dans la configuration CORS.  

---

### 5️⃣ Identification and Authentication Failures  

🚨 **Vulnerable:**
Autoriser les mots de passe faibles 
✅ **Secure:**
Contraindre la création de mots de passe complexes à l'aide de la fonction isPasswordStrong, qui vérifie si le mot de passe respecte les conditions suivantes : au moins 8 caractères, au moins une lettre minuscule, au moins une lettre majuscule, au moins un chiffre et au moins un caractère spécial. 
