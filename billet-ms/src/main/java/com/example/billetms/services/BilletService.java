package com.example.billetms.services;

import com.example.billetms.entities.Billet;

import java.util.List;

public interface BilletService {
    List<Billet> getAllBillets();
    List<Billet> getOutDatedBillets();

    List<Billet> getBilletsByBooker(String id);

    Billet getBillet  (Long id);
    Billet createBillet(BilletDTO billetDTO);
    void updateBilletExtendStatus(Long id);
    void deleteBillets(Long id);

}
