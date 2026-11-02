"""
verify_models.py -- Intelli-CA Model & API Smoke Test
=====================================================
Validates that:
1. GOOGLE_API_KEY is loaded from .env and is functional
2. LLM model (gemini-2.5-flash) resolves without errors
3. Embedding model (models/gemini-embedding-2) resolves without errors

Run from the backend/ directory:
    python tests/verify_models.py

Exit codes:
    0 = All checks passed
    1 = One or more checks failed
"""
import os
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# 0. Load .env from backend directory
# ---------------------------------------------------------------------------
env_file = Path(__file__).parent.parent / ".env"
print(f"\n[CONFIG] Loading .env from: {env_file}")

if not env_file.exists():
    print("[FAIL] .env file not found!")
    sys.exit(1)

with open(env_file) as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

api_key = os.environ.get("GOOGLE_API_KEY", "")
if not api_key:
    print("[FAIL] GOOGLE_API_KEY is not set in .env")
    sys.exit(1)

print(f"[PASS] API key loaded ({len(api_key)} chars, prefix: {api_key[:6]}...)\n")

results = {}

# ---------------------------------------------------------------------------
# 1. List available models (connectivity check)
# ---------------------------------------------------------------------------
print("=" * 60)
print("CHECK 1: API Connectivity & Model Discovery")
print("=" * 60)
try:
    from google import genai as google_genai
    client = google_genai.Client(api_key=api_key)
    models = list(client.models.list())
    model_names = [m.name for m in models]
    print(f"[PASS] Connected to Google GenAI API. {len(model_names)} models available.\n")
    results["api_connectivity"] = "PASS"
except Exception as e:
    print(f"[FAIL] Could not connect to Google GenAI API: {e}")
    results["api_connectivity"] = f"FAIL: {e}"
    sys.exit(1)

# ---------------------------------------------------------------------------
# 2. Verify LLM model -- gemini-2.5-flash
# ---------------------------------------------------------------------------
print("=" * 60)
print("CHECK 2: LLM Model -- gemini-2.5-flash")
print("=" * 60)
LLM_MODEL = "gemini-2.5-flash"
llm_full = f"models/{LLM_MODEL}"
if llm_full in model_names or LLM_MODEL in model_names:
    print(f"[PASS] '{LLM_MODEL}' found in available models list.")
    results["llm_model_listed"] = "PASS"
else:
    print(f"[WARN] '{LLM_MODEL}' not found by name match -- trying live invocation anyway.")
    results["llm_model_listed"] = "WARN (not in list by name)"

print(f"       Testing live invocation with a minimal prompt...")
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.messages import HumanMessage
    llm = ChatGoogleGenerativeAI(
        model=LLM_MODEL,
        temperature=0,
        google_api_key=api_key,
    )
    response = llm.invoke([HumanMessage(content="Reply with only: OK")])
    content = response.content if hasattr(response, "content") else str(response)
    print(f"[PASS] LLM responded: '{content.strip()[:80]}'")
    results["llm_invocation"] = "PASS"
except Exception as e:
    err = str(e)
    print(f"[FAIL] LLM invocation error: {err[:200]}")
    results["llm_invocation"] = f"FAIL: {err[:200]}"

# ---------------------------------------------------------------------------
# 3. Verify Embedding model -- models/gemini-embedding-2
# ---------------------------------------------------------------------------
print()
print("=" * 60)
print("CHECK 3: Embedding Model -- models/gemini-embedding-2")
print("=" * 60)
EMBED_MODEL = "models/gemini-embedding-2"
if EMBED_MODEL in model_names:
    print(f"[PASS] '{EMBED_MODEL}' found in available models list.")
    results["embed_model_listed"] = "PASS"
else:
    print(f"[WARN] '{EMBED_MODEL}' not in model list by exact name.")
    results["embed_model_listed"] = "WARN (not in list by exact name)"

print(f"       Testing live embedding with a test phrase...")
try:
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    embeddings = GoogleGenerativeAIEmbeddings(
        model=EMBED_MODEL,
        google_api_key=api_key,
    )
    result = embeddings.embed_query("This is a model connectivity test.")
    dim = len(result)
    print(f"[PASS] Embedding returned a vector of dimension {dim}.")
    if dim == 3072:
        print(f"       Dimension matches expected 3072 (gemini-embedding-2 spec).")
    results["embed_invocation"] = f"PASS (dim={dim})"
except Exception as e:
    err = str(e)
    print(f"[FAIL] Embedding invocation error: {err[:200]}")
    results["embed_invocation"] = f"FAIL: {err[:200]}"

# ---------------------------------------------------------------------------
# 4. Summary Report
# ---------------------------------------------------------------------------
print()
print("=" * 60)
print("SMOKE TEST SUMMARY")
print("=" * 60)
all_passed = True
for check, status in results.items():
    icon = "[PASS]" if status == "PASS" or status.startswith("PASS") else (
           "[WARN]" if status.startswith("WARN") else "[FAIL]"
    )
    if "[FAIL]" in icon:
        all_passed = False
    print(f"  {icon}  {check}: {status}")

print()
if all_passed:
    print("RESULT: ALL CHECKS PASSED. Backend is ready for deployment.")
    sys.exit(0)
else:
    print("RESULT: ONE OR MORE CHECKS FAILED. Review output above.")
    sys.exit(1)
