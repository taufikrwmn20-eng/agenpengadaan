with open('src/components/CertificateManagerCMS.tsx', 'r') as f:
    content = f.read()

old_code = '''      // Filter Tier 4 to this event and switch view
      setHistoryFilterEvent(eventName);
      loadSavedHistory();
      setActiveTier(4);
    } catch (err: any) {
      console.error('Error saving certificates:', err);
      onShowToast('Sertifikat berhasil dicetak dan disimpan.');
      setHistoryFilterEvent(eventName);
      loadSavedHistory();
      setActiveTier(4);
    } finally {'''

new_code = '''      // Filter Tier 4 to this event and switch view
      setHistoryFilterEvent(eventName);
      setActiveTier(4);
    } catch (err: any) {
      console.error('Error saving certificates:', err);
      onShowToast('Sertifikat berhasil dicetak dan disimpan (Namun mungkin gagal disimpan secara permanen karena melebihi batas penyimpanan).');
      setHistoryFilterEvent(eventName);
      setActiveTier(4);
    } finally {'''

content = content.replace(old_code, new_code)

with open('src/components/CertificateManagerCMS.tsx', 'w') as f:
    f.write(content)
